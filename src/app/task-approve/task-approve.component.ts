import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-responsive';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import swal from 'sweetalert';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-task-approve',
  standalone: true,
  imports:[RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule,MatDialogModule,FormsModule ],
  providers: [
    provideAnimations(),MatDialogModule
  ],
  templateUrl: './task-approve.component.html',
  styleUrl: './task-approve.component.scss'
})
export class TaskApproveComponent implements OnInit {
  taskId: string | null = null;
  form!: FormGroup;
  empForm!:FormGroup;
  readOnly = false;
  L3ButtonControls:boolean =true;
  L3FurtherAction:boolean =false;
  isOPCOHrequired:boolean =false;
  txtComments:string ='';
  txtLMComments:string='';
  txtLMCommentsyes:boolean=false;
  txtDHComments:string ='';
  txtDHCommentsyes:boolean=false;
  txtRACComments:string ='';
  txtRACCommentsyes:boolean=false;
  txtOPCOHComments:string ='';
  txtOPCOHCommentsyes:boolean=false;
  txtOPCOCHComments:string ='';
  txtOPCOCHCommentsyes:boolean=false;

  
  isSubmitted: boolean = false;
  status:string  ='';
   level:string  ='';
      opco :string  ='';
      aprLevel:string ='';
      depthead:string  ='';
      furtherclarification :string ='';
      attachments: any[] = [];
      lblLevel2Text = '';
      lblLevel3Text ='';
      lblLevel4Text ='';
      levelOptions:any; 
      levelApprovers:any; 
      selectedLevel='';
      selectedApprover='';
      approvers:any;
  constructor(private route: ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,public service: ApiService,
  private dialogRef: MatDialog,private fb: FormBuilder,private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    
    this.CreateEmpForm();
    this.CreateForm();
    this.service.getUserName().subscribe(res => {
        if (res != null) {
            let user = res as any;
            this.viewCOI(this.data.id);
            this.cd.detectChanges();
            //this.getMytasksCOIData();
        }
    });
    
}
CreateEmpForm():void{
this.empForm = this.fb.group({
  EmpName:[''],
  EmpNumber:[''],
  Designation:[''],
  Department:[''],
  MgrName:[''],
  MgrEmail:[''],
  Division:[''],
  Company:['']
})
}
CreateForm(): void {
  this.form = this.fb.group({
      radioAgreement: [''],
      question1: this.fb.group({
          radio1a: [''],
          radio1aDetails: [''],
      }),
      question2: this.fb.group({
          radio1b: [''],
          radio1bDetails: this.fb.array([this.createRowqb()]),
      }),
      question3: this.fb.group({
          radio1c: [''],
          radio1cDetails: this.fb.array([this.createRowqc()]),
      }),
      question4: this.fb.group({
          radio1d: [''],
          radio1dDetails: this.fb.array([this.createRowqd()]),
      }),
      question5: this.fb.group({
          radio2e: [''],
          radio2eDetails: this.fb.array([this.createRowqe()]),
      }),
      question6: this.fb.group({
          radio2f: [''],
          radio2fDetails: this.fb.array([this.createRowqf()]),
      }),
      question7: this.fb.group({
          radio2g: [''],
          radio2gDetails: this.fb.array([this.createRowqg()]),
      }),
      question8: this.fb.group({
          radio2h: [''],
          radio2hDetails: [''],
      })
  });
}
createRowqb(): FormGroup {
  return this.fb.group({
      qbname: [''],
      qbrelation: [''],
      qbbenifit: [''],
      qbdate: [''],
      qbvalue: [''],
      qbremarks: [''],
  });
}
createRowqc(): FormGroup {
  return this.fb.group({
      qcname: [''],
      qcrelation: [''],
      qccomprelation: [''],
      qcdate: [''],
      qcclarifictaion: [''],

  })
}
createRowqd(): FormGroup {
  return this.fb.group({
      qdname: [''],
      qdrelation: [''],
      qdcomprelation: [''],
      qddate: [''],
      qddetails: ['']
  })
}
createRowqe(): FormGroup {
  return this.fb.group({
      qecompany: [''],
      qerelation: [''],
      qebenifit: [''],
      qedate: [''],
      qevalue: [''],
      qeremarks: [''],
  })
}
createRowqf(): FormGroup {
  return this.fb.group({
      qfcompany: [''],
      qfcomprelation: [''],
      qfservice: [''],
      qfdate: [''],
      qfclarification: ['']
  })
}
createRowqg(): FormGroup {
  return this.fb.group({
      qgname: [''],
      qgposition: [''],
      qgcompany: [''],
      qgrelation: [''],
      qgapproved: [''],
      qgclarification: [''],
  })
}

viewCOI(taskId: any) {
  this.service.getCOI(taskId).subscribe(data => {
  var rowData=data;
  this.readOnly = true;
  this.populateForm(rowData); // Pass row data to the form
  this.populateEmpForm(rowData);
  this.toggleDisable(true);
  this.cd.detectChanges();
  });
  
}
populateEmpForm(data:any):void{
  this.empForm.patchValue({
    EmpName:data.EmployeeName,
    EmpNumber:data.EmployeeNumber,
    Designation:data.Designation,
    Department:data.Department,
    MgrName:data.ManagerName,
    MgrEmail:data.ManagerEmail,
    Division:data.Division,
    Company:data.Company
  })
}
populateForm(data: any): void {
  // Populate simple key-value pairs
  if(data.Status !="Approved" && data.Status !="Rejected"){
    if(data.Level == "LM")
      {
          $('#btnReview').val("Approve");
      }
      if(data.Level == "DH")
      {
          $('#btnReview').val("Approve");
      }
      if(data.Level == "RAC")
      {
          $('#btnReview').val("Reviewed and Closed");
      }
      
      if(data.Level == "OPCOH")
      {
          $('#btnReview').val("Accept");
      }
      if(data.Level == "OPCOCH")
      {
          $('#btnReview').val("Approve");
      }
     this.status = data.Status;
     this.level = data.Level;
     this.opco = data.OPCO;
     this.aprLevel = data.cLevel;
     this.depthead = data.DeptHeadEmail;
     this.furtherclarification = data.ApproverLevel;
     if(data.Level == "RAC" || data.Level == "OPCOH")
      {
          this.isOPCOHrequired=true;
      }
      else
      {
        this.isOPCOHrequired= false;
      }
        if(data.ManagerComments !=null && data.ManagerComments !="")
          {
            this.txtLMComments=data.ManagerComments;
            this.txtLMCommentsyes=true;
          }
          else
          {
            this.txtLMComments="";
            this.txtLMCommentsyes=false;
          }
          if(data.DHComments !=null && data.DHComments !="")
          {
            this.txtDHComments =data.DHComments;
            this.txtDHCommentsyes = true;
                  if(data.OPCO != null && data.OPCO == "Retail")
            {
              this.lblLevel2Text="HC Comments";
            }else{
              this.lblLevel2Text= "Department Head Comments";
            }
          }
          else
          {
            this.txtDHComments ="";
            this.txtDHCommentsyes = false;
          }
          if(data.RACComments !=null && data.RACComments !="")
          {
            this.txtRACComments = data.RACComments;
           this.txtRACCommentsyes = true;
          }
          else
          {
            this.txtRACComments = "";
           this.txtRACCommentsyes = false;
          }
          if(data.OPCOHComments !=null && data.OPCOHComments !="")
          {
           this.txtOPCOHComments = data.OPCOHComments;
            this.txtOPCOHCommentsyes = true;
            this.lblLevel3Text= data.Level3Approver+' Comments';
          }
          else
          {
            this.txtOPCOHComments = "";
            this.txtOPCOHCommentsyes = false;
          }
          if(data.OPCOCHComments !=null && data.OPCOCHComments !="")
          {
            this.txtOPCOCHComments = data.OPCOCHComments;
            this.txtOPCOCHCommentsyes = true;
            this.lblLevel4Text= data.Level4Approver+' Comments';
          }
          else
          {
            this.txtOPCOCHComments = "";
            this.txtOPCOCHCommentsyes = false;
          }
          this.attachments = [];
          if (data.Attachments) {
            this.attachments = data.AttachmentFiles;
          }

  this.form.patchValue({
      radioAgreement:data.Agree,
    question1: {
      radio1a: data.QuestionA,
      radio1aDetails: data.QuestionAComment,
    },
    question2: {
      radio1b: data.QuestionB,
    },
    question3: {
      radio1c: data.QuestionC,
    },
    question4: {
      radio1d: data.QuestionD,
    },
    question5: {
      radio2e: data.QuestionE,
    },
    question6: {
      radio2f: data.QuestionF,
    },
    question7: {
      radio2g: data.QuestionG,
    },

    question8: {
      radio2h: data.QuestionH,
      radio2hDetails: data.QuestionHComment || '',
    },
  });

  const question2Array = this.form.get('question2.radio1bDetails') as FormArray;
  const question2Data = JSON.parse(data.QuestionBComment || '[]');
  question2Array.clear();
  question2Data.forEach((item: any,index:number) => {
    question2Array.push(
      this.fb.group({
          qbname: item[`qbname${index + 1}`] || '',
          qbrelation: item[`qbrelation${index + 1}`] || '',
          qbbenifit: item[`qbbenifit${index + 1}`] || '',
          qbdate: item[`qbdate${index + 1}`] || '',
          qbvalue: item[`qbvalue${index + 1}`] || '',
          qbremarks: item[`qbremarks${index + 1}`] || '',
      })
    );
  });

  const question3Array = this.form.get('question3.radio1cDetails') as FormArray;
  const question3Data = JSON.parse(data.QuestionCComment || '[]');
  question3Array.clear();
  question3Data.forEach((item: any,index:number) => {
      question3Array.push(
      this.fb.group({
          qcname: item[`qcname${index + 1}`] || '',
          qcrelation: item[`qcrelation${index + 1}`] || '',
          qccomprelation: item[`qccomprelation${index + 1}`] || '',
          qcdate: item[`qcdate${index + 1}`] || '',
          qcclarifictaion: item[`qcclarifictaion${index + 1}`] || ''
      })
    );
  });

  const question4Array = this.form.get('question4.radio1dDetails') as FormArray;
  const question4Data = JSON.parse(data.QuestionDComment || '[]');
  question4Array.clear();
  question4Data.forEach((item: any,index:number) => {
      question4Array.push(
      this.fb.group({
          qdname: item[`qdname${index + 1}`] || '',
          qdrelation: item[`qdrelation${index + 1}`] || '',
          qdcomprelation: item[`qdcomprelation${index + 1}`] || '',
          qddate: item[`qddate${index + 1}`] || '',
          qddetails: item[`qddetails${index + 1}`] || ''
      })
    );
  });

  const question5Array = this.form.get('question5.radio2eDetails') as FormArray;
  const question5Data = JSON.parse(data.QuestionEComment || '[]');
  question5Array.clear();
  question5Data.forEach((item: any,index:number) => {
      question5Array.push(
      this.fb.group({
          qecompany: item[`qecompany${index + 1}`] || '',
          qerelation: item[`qerelation${index + 1}`] || '',
          qebenifit: item[`qebenifit${index + 1}`] || '',
          qedate: item[`qedate${index + 1}`] || '',
          qevalue: item[`qevalue${index + 1}`] || '',
          qeremarks: item[`qeremarks${index + 1}`] || '',
      })
    );
  });

  const question6Array = this.form.get('question6.radio2fDetails') as FormArray;
  const question6Data = JSON.parse(data.QuestionFComment || '[]');
  question6Array.clear();
  question6Data.forEach((item: any,index:number) => {
    question6Array.push(
      this.fb.group({
          qfcompany: item[`qfcompany${index + 1}`] || '',
          qfcomprelation: item[`qfcomprelation${index + 1}`] || '',
          qfservice: item[`qfservice${index + 1}`] || '',
          qfdate: item[`qfdate${index + 1}`] || '',
          qfclarification: item[`qfclarification${index + 1}`] || ''
      })
    );
  });

  const question7Array = this.form.get('question7.radio2gDetails') as FormArray;
  const question7Data = JSON.parse(data.QuestionGComment || '[]');
  question7Array.clear();
  question7Data.forEach((item: any,index:number) => {
    question7Array.push(
      this.fb.group({
          qgname: item[`qgname${index + 1}`] || '',
          qgposition: item[`qgposition${index + 1}`] || '',
          qgrelation: item[`qgrelation${index + 1}`] || '',
          qgcompany: item[`qgcompany${index + 1}`] || '',
          qgapproved: item[`qgapproved${index + 1}`] || '',
          qgclarification: item[`qgclarification${index + 1}`] || ''
      })
    );
  });
  }
  
  this.cd.detectChanges();
}
fn_submittoopco(){
  if(this.selectedLevel !="0" && this.selectedLevel !="" && this.selectedApprover != null && this.selectedApprover != "0" && this.selectedApprover != ""){
    if(this.txtComments !=="" && this.txtComments != null){
        
        var reviewstatus = "";	
        var managerstatus = "";	
        var approverlevel = "";
        var ceostatus = "";
        var pendingwith = "";
        var assignedTo="";
        var stage="";
        var workflowtrigger="";
        var aprlevel2 = "Level3";
        reviewstatus = "Pending With "+ this.selectedApprover;
        managerstatus = "Approved by Compliance";   
        stage ="Inprogress";
        workflowtrigger="Yes";
        pendingwith = this.selectedApprover;
        assignedTo = this.selectedApprover;
        if(this.aprLevel == 'Level3'){
            approverlevel = "OPCOH";
            aprlevel2 = "Level4"
        }
        if(this.aprLevel == 'Level4'){
            approverlevel = "OPCOCH";
            aprlevel2 = "Level5"
            if(this.furtherclarification != ""){
                managerstatus = "Approved by "+ this.furtherclarification +"";
            }
        }
        var ItemID = this.data.id;
        var item:any = {
                'Status': reviewstatus,
                'ManagerStatus':managerstatus,
                'Level':approverlevel,
                'Stage':stage,
                'PendingWith':pendingwith,
                'AssignedTo':assignedTo,
                'WorkflowTrigger':workflowtrigger,
                'Approver':this.selectedApprover,
                'ApproverLevel':this.selectedLevel,
                'cLevel':aprlevel2
        };
        switch(this.aprLevel){
            case "LM":
            item['ManagerComments'] = this.txtComments;
            break;
            case "DH":
            item['DHComments']=this.txtComments;
            break;
            case "RAC":
            item['RACComments']=this.txtComments;
            item['Level3Approver']=this.selectedLevel;
            break;
            case "OPCOH":
            item['OPCOHComments']=this.txtComments;
            item['Level4Approver']=this.selectedLevel;
            break;
            case "OPCOCH":
            item['OPCOCHComments']=this.txtComments;
            break;
            default:
            item['ManagerComments'] = this.txtComments;
            break;
        }
        let Attachments = (this.file?.length > 0) ? this.file[0]:null
        if (this.updateitem(ItemID,item,Attachments)) {
                swal(
                    '',
                    'Request has been submitted successfully',
                    'success'
                    ).then(function () {
                      window.location.reload();
                       // window.location.href = "https://mafportal.maf.ae/Compliance/SitePages/COIHolding.aspx";
                    });
            
        }

    }else{
        swal('','Provide your recomendation in the comments box','info');
        //alert("Please provide reason for rejection in the comments box.");
    }
}else{
    swal('','Please select the next level approver','info');
}

}
fn_gobackl3(){
  this.L3ButtonControls=true;
  this.L3FurtherAction=false;
  this.cd.detectChanges();
  return false;
}
 fn_furtheraction() {
        this.L3ButtonControls =false;
        this.L3FurtherAction=true;
    this.service.getApprovers(this.opco,this.aprLevel).subscribe((data)=>{
    var dataset=data as any;
    this.approvers=dataset.value;
    
    this.levelOptions = [...new Set(this.approvers.map((item:any) => item.Title))];
    
    this.cd.detectChanges();
    return false;
  })
}
onLevelChange(event: Event): void {
  const selectedValue = (event.target as HTMLSelectElement).value;
  this.selectedLevel = selectedValue;
  this.levelApprovers = [...new Set(this.approvers.filter((a:any)=>a.Title== this.selectedLevel)
    .map((item:any) =>({
      ApproverEmail: item.ApproverEmail,
      ApproverName:item.ApproverName})))];
}
onapproverChange(event: Event): void {
  const selectedValue = (event.target as HTMLSelectElement).value;
  this.selectedApprover = selectedValue;
}
  

 getDistResults(items:any,propertyName:any){
  var result:any = [];
  var distResult:any=[];
  $.each(items, function(index, item) {
  if ($.inArray(item[propertyName], result)==-1) {
      result.push(item[propertyName]);
      distResult.push(item);
  }
  });
  return distResult;
}
 getFullUrl(serverRelativeUrl: string): string {
        const baseUrl = environment.sp; 
        return `${baseUrl}${serverRelativeUrl}`;
      }
file:any;
    onFileSelected(event: any) {
        const files: FileList = event.target.files;
        if (files.length > 0) {
          this.file = files; // Get the first file (if multiple files selected, use loop to handle all)
        }
      }
 fn_complete() {	
 
  if((this.level == "OPCOH" || this.level == "OPCOCH" || (this.opco == "Retail" && this.level == "DH")) && (this.txtComments =="" || this.txtComments == null)){
      swal('','Provide your feedback in the comments box','info');
      return
  }else{
      
      var reviewstatus = "Pending With Department Head";	
      var managerstatus = "Approved by line manager";	
      var approverlevel = "";
      var cLevel = "Level2";
      var ceostatus = "";
      var pendingwith = "";
      var assignedTo="";
      var stage="";
      var workflowtrigger="Yes";
  
      if(this.level == "LM" && this.opco != "Retail"){
          reviewstatus = "Pending With Department Head";
          managerstatus = "Approved by line manager";
          pendingwith = ""; //Check value for pending with
          assignedTo = ""; //replace this with depthead
          approverlevel = "DH";
          stage ="Inprogress";
          workflowtrigger="Yes";
      }else{
          reviewstatus = "Pending With HC";
          managerstatus = "Approved by line manager";
          pendingwith = ""; //Check value for pending with
          assignedTo = ""; //replace this with depthead
          approverlevel = "DH";
          stage ="Inprogress";
          workflowtrigger="Yes";
      }
      

      if(this.level == "DH" && this.opco != "Retail"){
          reviewstatus = "Pending With Compliance";
          managerstatus = "Approved by Department Head";
          pendingwith = this.depthead; //Check value for pending with
          assignedTo = ""; //replace this with depthead
          approverlevel = "RAC";
          stage ="Inprogress";
          workflowtrigger="Yes";
          cLevel = "Level3";
      }
      if(this.level == "DH" && this.opco == "Retail"){
          reviewstatus = "Pending With Compliance";
          managerstatus = "Approved by HC";
          pendingwith = this.depthead; //Check value for pending with
          assignedTo = ""; //replace this with depthead
          approverlevel = "RAC";
          stage ="Inprogress";
          workflowtrigger="Yes";
          cLevel = "Level3";
      }
      
      if(this.level == "RAC"){
      reviewstatus = "Approved";
      managerstatus = "Reviwed and Closed by Compliance";
      pendingwith = "";
      assignedTo="";
      approverlevel = "Completed";
      stage ="Completed";
      workflowtrigger="Yes";
      }
      if(this.level == "OPCOH"){
          reviewstatus = "Approved";
          managerstatus = "Approved by OPCO Head";
          pendingwith = "";
          assignedTo=""; // for  my completed approvals do we need to keep assigned to value or not?
          approverlevel = "Completed";
          stage ="Completed";
          workflowtrigger="Yes";
          cLevel = "";
          if(this.furtherclarification != ""){
              managerstatus = "Approved by "+ this.furtherclarification +"";
          }
      }
      
      if(this.level == "RACF"){
          reviewstatus = "Approved";
          managerstatus = "Approved by Compliance";
          pendingwith = "";
          assignedTo="";
          approverlevel = "Completed";
          stage ="Completed";
          workflowtrigger="Yes";
      }
      if(this.level == "OPCOCH"){
          reviewstatus = "Approved";
          managerstatus = "Approved by OPCO Country Head";
          pendingwith = "";
          assignedTo=""; // for  my completed approvals do we need to keep assigned to value or not?
          approverlevel = "Completed";
          stage ="Completed";
          workflowtrigger="Yes";
          cLevel = "";
          if(this.furtherclarification != ""){
              managerstatus = "Approved by "+ this.furtherclarification +"";
          }
      }
      var ItemID = this.data.id;
      var item:any = {
          'Status': reviewstatus,
          'ManagerStatus':managerstatus,
          'Level':approverlevel,
          'cLevel':cLevel,
          'Stage':stage,
          'PendingWith':pendingwith,
          'AssignedTo':  (managerstatus !== "Reviwed and Closed by Compliance") ?'Chandana.Chikati1-e@maf.ae':'', // assignedTo,
          'WorkflowTrigger':workflowtrigger,
      };
      switch(this.level){
          case "LM":
          item['ManagerComments'] = this.txtComments; //$('#txtComments').val();
          break;
          case "DH":
          item['DHComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "RAC":
          item['RACComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "RACF":
          item['RACComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "OPCOH":
          item['OPCOHComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "OPCOCH":
          item['OPCOCHComments']=this.txtComments; //$('#txtComments').val();
          break;
          default:
          item['ManagerComments'] = this.txtComments; //$('#txtComments').val();
          break;
      }
      let Attachments = (this.file?.length > 0) ? this.file[0]:null
      if (this.updateitem(ItemID,item,Attachments)) {
          
              swal(
                  '',
                  'Request has been submitted successfully',
                  'success'
                  ).then(function () {
                    window.location.reload();
                     // window.location.href = "https://mafportal.maf.ae/Compliance/SitePages/COIHolding.aspx";
                  });
          
      }
 
  }
}

fn_reject() {
  if(this.txtComments !="" && this.txtComments !== null){
  var managerstatus = "Rejected by line manager";	
  
  //var ceostatus = "";
  if(this.level == "LM"){			
    managerstatus = "Rejected by line manager";			
  }
  if(this.level == "DH"){			
    managerstatus = "Rejected by department head";			
  }
      if(this.level == "RAC" || this.level == "RACF"){			
    managerstatus = "Rejected by Risk And Compliance";			
  }
      if(this.level == "OPCOH"){			
    managerstatus = "Rejected by OPCO head";			
  }
      if(this.level == "OPCOCH"){			
    managerstatus = "Rejected by OPCO Country head";			
  }
      var ItemID = this.data.id;
      //var update_url = "/_api/web/lists/GetByTitle('COIHolding2022')/items('" + ItemID + "')";
      var item:any = {
          'Status': 'Rejected',
          'ManagerStatus':managerstatus,
          'WorkflowTrigger':'Yes',
          'RejectedComments': $('#txtComments').val(),
          'PendingWith':"",
          'AssignedTo': ""
          
      };
      switch(this.level){
          case "LM":
          item['ManagerComments'] =this.txtComments; //$('#txtComments').val();
          break;
          case "DH":
          item['DHComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "OPCOH":
           item['OPCOHComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "OPCOCH":
           item['OPCOCHComments']=this.txtComments; //$('#txtComments').val();
          break;
          case "RAC":
          case "RACF":
           item['RACComments']=this.txtComments; //$('#txtComments').val();
          break;
          default:
           item['ManagerComments'] = this.txtComments; //$('#txtComments').val();
          break;
      }
      let Attachments = (this.file?.length > 0) ? this.file[0]:null
      if (this.updateitem(ItemID,item,Attachments)) {
          var res_file = false; // $('#req_chooseFile')[0].files[0];
          if (res_file) {
              //uploadthefiles(ItemID, res_file,'Request has been rejected successfully');
          }else{
              swal(
                  '',
                  'Request has been rejected successfully',
                  'success'
                  ).then(function () {
                    window.location.reload();
                     // window.location.href = "https://mafportal.maf.ae/Compliance/SitePages/COIHolding.aspx";
                  });
          }
      }
  }else{
          swal('','Provide justification for rejection in the comments box','info');
    //alert("Please provide reason for rejection in the comments box.");
  }		
  }


updateitem(Id:any,updateData:any,attachments:any) {
  var update_obj = true;
  
  this.service.UpdateCOI(Id,updateData,attachments).then((result)=>{
  });
  // var wUrl = _spPageContextInfo.webAbsoluteUrl + webUrl;
  // $.ajax({
  //     url: wUrl,
  //     type: "POST",
  //     async: false,
  //     headers: {
  //         "Accept": "application/json;odata=verbose",
  //         "Content-Type": "application/json;odata=verbose",
  //         "X-RequestDigest": $("#__REQUESTDIGEST").val(),
  //         "IF-MATCH": "*",
  //         "X-HTTP-Method": "MERGE"
  //     },
  //     data: JSON.stringify(updateData),
  //     success: function (data) {
  //     },
  //     error: function (data) {
  //         update_obj = false;
  //     }
  // });

  return update_obj;
}
toggleDisable(disabled: boolean) {
  if (disabled) {
    this.form.get('radioAgreement')?.disable();
    this.form.get('question1.radio1a')?.disable();
    this.form.get('question2.radio1b')?.disable();
    this.form.get('question3.radio1c')?.disable();
    this.form.get('question4.radio1d')?.disable();
    this.form.get('question5.radio2e')?.disable();
    this.form.get('question6.radio2f')?.disable();
    this.form.get('question7.radio2g')?.disable();
    this.form.get('question8.radio2h')?.disable();

    this.form.get('question1.radio1aDetails')?.disable();
    this.form.get('question2.radio1bDetails')?.disable();
    this.form.get('question3.radio1cDetails')?.disable();
    this.form.get('question4.radio1dDetails')?.disable();
    this.form.get('question5.radio2eDetails')?.disable();
    this.form.get('question6.radio2fDetails')?.disable();
    this.form.get('question7.radio2gDetails')?.disable();
    this.form.get('question8.radio2hDetails')?.disable();

  } else {
      this.form.get('radioAgreement')?.enable();
      this.form.get('question1.radio1a')?.enable();
      this.form.get('question2.radio1b')?.enable();
      this.form.get('question3.radio1c')?.enable();
      this.form.get('question4.radio1d')?.enable();
      this.form.get('question5.radio2e')?.enable();
      this.form.get('question6.radio2f')?.enable();
      this.form.get('question7.radio2g')?.enable();
      this.form.get('question8.radio2h')?.enable();

      this.form.get('question1.radio1aDetails')?.enable();
      this.form.get('question2.radio1bDetails')?.enable();
      this.form.get('question3.radio1cDetails')?.enable();
      this.form.get('question4.radio1dDetails')?.enable();
      this.form.get('question5.radio2eDetails')?.enable();
      this.form.get('question6.radio2fDetails')?.enable();
      this.form.get('question7.radio2gDetails')?.enable();
      this.form.get('question8.radio2hDetails')?.enable();
  }
}
get radio1aDetails() {
  return this.form.get('question1')?.get('radio1aDetails');
}

get radio1bDetails(): FormArray {
  return this.form.get('question2.radio1bDetails') as FormArray;
}

get radio1cDetails(): FormArray {
  return this.form.get('question3.radio1cDetails') as FormArray;
}
get radio1dDetails(): FormArray {
  return this.form.get('question4.radio1dDetails') as FormArray;
}
get radio2eDetails(): FormArray {
  return this.form.get('question5.radio2eDetails') as FormArray;
}
get radio2fDetails(): FormArray {
  return this.form.get('question6.radio2fDetails') as FormArray;
}
get radio2gDetails(): FormArray {
  return this.form.get('question7.radio2gDetails') as FormArray;
}
get radio2hDetails() {
  return this.form.get('question8')?.get('radio2hDetails');
}

  close(): void {
    this.dialogRef.closeAll();
  }
}

