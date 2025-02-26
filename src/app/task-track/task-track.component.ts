import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import $, { data } from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-responsive';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskApproveComponent } from '../task-approve/task-approve.component';
import { environment } from '../../environments/environment';
import { dateFormatValidator } from '../date.validators';



@Component({
    selector: 'app-task-track',
    standalone: true,
    imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
    providers: [
        provideAnimations(), MatDialogModule
    ],
    templateUrl: './task-track.component.html',
    styleUrl: './task-track.component.scss'
})

export class TaskTrackComponent

    implements OnInit { //,AfterViewInit
        @ViewChild('myModal') formSection!: ElementRef;
        scrollToForm() {
            this.formSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.cd.detectChanges();
          }
        form!: FormGroup;
    empForm!: FormGroup;
    radio1ayes: boolean = false;
    radio1byes: boolean = false;
    radio1cyes: boolean = false;
    radio1dyes: boolean = false;
    radio2eyes: boolean = false;
    radio2fyes: boolean = false;
    radio2gyes: boolean = false;
    radio2hyes: boolean = false;
    footermsg: boolean = false;
    activeTab: string = 'home';
    readOnly = false;
    txtLMComments: string = '';
    txtLMCommentsyes: boolean = false;
    txtDHComments: string = '';
    txtDHCommentsyes: boolean = false;
    txtRACComments: string = '';
    txtRACCommentsyes: boolean = false;
    txtOPCOHComments: string = '';
    txtOPCOHCommentsyes: boolean = false;
    txtOPCOCHComments: string = '';
    txtOPCOCHCommentsyes: boolean = false;
    attachments: any[] = [];
    lblLevel2Text = '';
    lblLevel3Text ='';
    lblLevel4Text ='';
    mytasksceo:boolean=false;
    mycompletedtasksceo:boolean=false;
    mycompletedtasksco:boolean=false;
    mycompletedtasksstatus:boolean=false;
    mycompletedtaskscols:boolean=false;
    mycompletedtaskscogs:boolean=false;
    mycompletedtasksstatusglobalsolutions:boolean=false;
    mycompletedtasksstatusls:boolean=false;
    mycompletedtaskscoretail:boolean=false;
    mycompletedtasksstatusretail:boolean=false;
    spnmyrequests:string='0';
    spnmytasks:string='0';
    spnmytasksceo:string='0';
    spnmytaskscompletedceo:string='0';
    spnmytaskscompletedco:number=0;
    spnmytaskscompletedcols:string='0';
    spnmytaskscompletedcogs:string='0';
    spnmytaskscompletedcoretail:string='0';
    spndeclaredcoi:string='0';
    spndeclaredcoiretail:string='0';
    spndeclaredcoigs:string='0';
    spndeclaredcoils:string='0';
    constructor(private dialog: MatDialog, public router: Router, public service: ApiService, private fb: FormBuilder, private cd: ChangeDetectorRef
    ) {


    }

    openModal() {
        this.myModal = true;
        this.cd.detectChanges();
        this.scrollToForm();
    }

    closeModal() {
        this.myModal = false;
        this.form.reset();
        this.CreateForm();
        this.readOnly = false;
    }
    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }
    user:any;
    userId:any;
    userName:any;
    ngOnInit(): void {
        this.CreateForm();
        this.radioChanges();
        this.service.getUserName().subscribe(res => {
            if (res != null) {
                let user = res as any;
                this.user=user;
                this.userId=user.d.Id;
                this.userName=user.d.Title;
               // console.log(user.d.Id);
                this.initialiazeDatatable(user.d.Id); // render datatable based on current user, as of now retrieving all data
                this.getMytasksCOIData();
                //this.isUserMember("Holding CEO group",this.userId);
                this.mytasksceo=true;
                this.mycompletedtasksceo=true;
                this.getMytaskCEOCompletedData();
                this.getMytaskCEOData();
                this.getDeclaredCOI();
                
		        //this.isUserMemberCO("Holding CO",this.userId);
                this.mycompletedtasksco = true;
                this.mycompletedtasksstatus =true;
                this.getMytasksCOIData();
                this.getAllCOICompletedData('Holding');
                
                //this.isUserMemberCOLS();
                this.mycompletedtaskscols = true;
                this.getAllCOICompletedData('Lifestyle');
                
                //this.isUserMemberCOGS();
                this.mycompletedtaskscogs = true;
                this.mycompletedtasksstatusglobalsolutions = true;
                this.getAllCOICompletedData('Global Solutions');
                this.getDeclaredCOIGS();
                
                //this.isUserMemberCOGSRetail();
                this.mycompletedtaskscoretail = true;
                this.mycompletedtasksstatusretail=true;
                this.getAllCOICompletedData('Retail');
                this.getDeclaredCOIRetail();

                  //this.isUserMemberCOGS();
                  this.mycompletedtaskscols = true;
                  this.mycompletedtasksstatusls = true;
                  this.getAllCOICompletedData('Lifestyle');
                  this.getDeclaredCOILS();

                this.getAllCOICount();
                this.cd.detectChanges();
            }
        });
        
    }

    initialiazeDatatable(userid:any) {
        this.service.getUserCOIData(userid).subscribe(data => {
            let r=data as any;
            var dataset1 = r.value;
            this.spnmyrequests=dataset1.length;
            const table: any = $("#tblMycoi");
            table.DataTable({
                "order": [[0, "desc"]],
                destroy: true,
                "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "iDisplayLength": 10,
                rowReorder: {
                    selector: 'td:nth-child(2)'
                },
                responsive: true,
                data: dataset1,
                "columns": [

                    {
                        "data": "ID", "class": "hide",
                    },
                    {
                        "orderable": false,
                        "data": null,
                        "defaultContent": '',
                        "render": function (e: any) {
                            var status_html = "";
                            if (e.ID != null) {
                                status_html = '<a style="padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;" data-task="' + e.ID + '" data-tab="myrequest" class="anc_task">View COI </a>';
                                return status_html;

                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "orderable": false,
                        "data": null,
                        "defaultContent": '',
                        "render": function (e: any) {

                            if (e.EmployeeName != null && e.EmployeeName != "") {
                                var status_html = "";
                                status_html = "<span style=''>" + e.EmployeeName + "<span>";
                            } else {
                                status_html = "<span style=''><span>";
                            }
                            return status_html;

                        }
                    },

                    {
                        "orderable": false,
                        "data": null,
                        "defaultContent": '',
                        "render": function (e: any) {

                            if (e.Status != null && e.Status != "") {
                                var status_html = "";
                                status_html = "<span style=''>" + e.Status + "<span>";
                            } else {
                                status_html = "<span style=''>Submitted to Manager<span>";
                            }
                            return status_html;

                        }
                    },
                    {
                        "orderable": false,
                        "data": null,
                        "defaultContent": '',
                        "render": function (e: any) {
                            if (e.Created != null) {
                                return new Date(e.Created).toLocaleDateString();
                            } else {
                                return "";
                            }
                        }
                    }
                ]
            });
            $('#tblMycoi tbody').on('click', '.anc_task', (event) => {
                const rowData = $(event.currentTarget).closest('tr').data();
                const taskId = $(event.currentTarget).data('task');

                // Find the row data using taskId
                const selectedRow = dataset1.find((item:any) => item.ID === taskId);
                if (selectedRow) {
                    this.viewCOI(taskId);
                }
                
            });
        });
    }
    print:boolean=false;
    myModalView: boolean = false;
    myModal: boolean = false;
    fn_resubmit() {
        this.myModalView = false;
        this.myModal = true;
        this.CreateForm();
        this.readOnly = false;
        this.cd.detectChanges();
    }

    fn_print(){
        this.router.navigate(['/print',this.printTaskId]);
        
    }
    printTaskId:any;
    viewCOI(taskId: any) {
        this.printTaskId='';
        this.service.getCOI(taskId).subscribe(data => {
            this.printTaskId=taskId;
            var rowData=data;
            this.readOnly = true;
            this.populateForm(rowData); // Pass row data to the form
            this.toggleDisable(true);
            // Set form to read-only mode
            this.myModal = true;
            this.cd.detectChanges();
            this.scrollToForm();
            
        });

       
        // this.service.getCOI(taskid).then(res => {
        //     console.log(res);
        // });
    }
    ResetComments(){
        this.hideAttachments =true;
        this.txtLMCommentsyes = false;
        this.txtDHCommentsyes = false;
        this.txtRACCommentsyes = false;
        this.txtOPCOHCommentsyes = false;
        this.txtOPCOCHCommentsyes = false;
    }
    hideAttachments:boolean =true;
    populateForm(data: any): void {
       
        this.ResetComments();
        // Populate simple key-value pairs
        this.form.patchValue({
            employeeDetails: {
                EmpName: data.EmployeeName,
                EmpNumber: data.EmployeeNumber,
                Designation: data.Designation,
                Department: data.Department,
                MgrName: data.ManagerName,
                MgrEmail: data.ManagerEmail,
                Division: data.Division,
                Company: data.Company,
                OPCO:data.OPCO
            },
            comments: {
                LMComments: data.ManagerComments && data.ManagerComments.trim() !== "" ? data.ManagerComments : "",
                DHComments: data.DHComments && data.DHComments.trim() !== "" ? data.DHComments : "",
                RACComments: data.RACComments && data.RACComments.trim() !== "" ? data.RACComments : "",
                OPCOHComments: data.OPCOHComments && data.OPCOHComments.trim() !== "" ? data.OPCOHComments : "",
                OPCOCHComments: data.OPCOCHComments && data.OPCOCHComments.trim() !== "" ? data.OPCOCHComments : "",
            },
            radioAgreement: data.Agree,
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
        question2Data.forEach((item: any, index: number) => {
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
        question3Data.forEach((item: any, index: number) => {
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
        question4Data.forEach((item: any, index: number) => {
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
        question5Data.forEach((item: any, index: number) => {
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
        question6Data.forEach((item: any, index: number) => {
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
        question7Data.forEach((item: any, index: number) => {
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
        if(this.activeTab === 'home' && data.Status == 'Rejected'){
            switch(data.Level){
                case "LM":
                    this.txtLMCommentsyes = !!data.ManagerComments && data.ManagerComments.trim() !== "";
                    break;
                
                case "DH":
                    this.txtDHCommentsyes = !!data.DHComments && data.DHComments.trim() !== "";
                    
                break;
                case "OPCOH":
                   
                    this.txtOPCOHCommentsyes = !!data.OPCOHComments && data.OPCOHComments.trim() !== "";
                    
                break;
                case "OPCOCH":
                    this.txtOPCOCHCommentsyes = !!data.OPCOCHComments && data.OPCOCHComments.trim() !== "";
                break;
                case "RAC":
                case "RACF":
                    this.txtRACCommentsyes = !!data.RACComments && data.RACComments.trim() !== "";
                break;
                default:
                    this.txtLMCommentsyes = !!data.ManagerComments && data.ManagerComments.trim() !== "";
                break;
            }
        }
        else
        {
        this.txtLMCommentsyes = false;
        this.txtDHCommentsyes = false;
        this.txtRACCommentsyes = false; 
        this.txtOPCOHCommentsyes = false;
        this.txtOPCOCHCommentsyes = false;
        }
        // Update labels dynamically
        if (data.DHComments && data.DHComments.trim() !== "") {
            if (data.OPCO && data.OPCO === "Retail") {
                 this.lblLevel2Text= 'HC Comments';
            } else {
                this.lblLevel2Text= 'Department Head Comments';
            }
        }

        if (data.OPCOHComments && data.OPCOHComments.trim() !== "") {
             this.lblLevel3Text= data.Level3Approver + ' Comments';
        }

        if (data.OPCOCHComments && data.OPCOCHComments.trim() !== "") {
            this.lblLevel4Text= data.Level4Approver + ' Comments';
        }
        this.attachments = [];
    if (data.Attachments) {
        if(this.activeTab === 'home' && (data.Status !== 'Submitted' && data.Status !== 'Pending With Line Manager')){
          this.hideAttachments=true;
        }
        else{
            this.hideAttachments=false;
        }
        this.attachments = data.AttachmentFiles;
    }

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
    getFullUrl(serverRelativeUrl: string): string {
        const baseUrl = environment.sp; 
        return `${baseUrl}${serverRelativeUrl}`;
      }
    
      checkFullFormValidity(formGroup: FormGroup, parentKey: string = ''): void {
        Object.keys(formGroup.controls).forEach((key) => {
          const control = formGroup.get(key);
          const controlKey = parentKey ? `${parentKey}.${key}` : key;
      
          if (control instanceof FormGroup) {
            // Recursively check nested FormGroups
            this.checkFullFormValidity(control, controlKey);
          } else if (control instanceof FormArray) {
            // Check each control in FormArray
            control.controls.forEach((arrayControl, index) => {
              this.checkFullFormValidity(
                arrayControl as FormGroup,
                `${controlKey}[${index}]`
              );
            });
          } else {
            // Log individual controls
            console.log(
              `Control: ${controlKey}, Valid: ${control?.valid}, Touched: ${control?.touched}, Disabled: ${control?.disabled}`
            );
          }
        });
      }
    CreateForm(): void {
        this.form = this.fb.group({
            employeeDetails: this.fb.group({
                EmpName: [{ value: '', disabled: true }],
                EmpNumber:[{ value: '', disabled: true }],
                Designation: [{ value: '', disabled: true }],
                Department: [{ value: '', disabled: true }],
                MgrName: [{ value: '', disabled: true }],
                MgrEmail: [{ value: '', disabled: true }],
                Division:[{ value: '', disabled: true }],
                Company:[{ value: '', disabled: true }],
                OPCO:[{ value: '', disabled: true }]
            }),
            comments: this.fb.group({
                LMComments: [{ value: '', disabled: true }],
                DHComments: [{ value: '', disabled: true }],
                RACComments: [{ value: '', disabled: true }],
                OPCOHComments: [{ value: '', disabled: true }],
                OPCOCHComments: [{ value: '', disabled: true }]
            }),
            radioAgreement: ['', Validators.required],
            question1: this.fb.group({
                radio1a: ['', Validators.required],
                radio1aDetails: [''],
            }),
            question2: this.fb.group({
                radio1b: ['', Validators.required],
                radio1bDetails: this.fb.array([this.createRowqb()]),
            }),
            question3: this.fb.group({
                radio1c: ['', Validators.required],
                radio1cDetails: this.fb.array([this.createRowqc()]),
            }),
            question4: this.fb.group({
                radio1d: ['', Validators.required],
                radio1dDetails: this.fb.array([this.createRowqd()]),
            }),
            question5: this.fb.group({
                radio2e: ['', Validators.required],
                radio2eDetails: this.fb.array([this.createRowqe()]),
            }),
            question6: this.fb.group({
                radio2f: ['', Validators.required],
                radio2fDetails: this.fb.array([this.createRowqf()]),
            }),
            question7: this.fb.group({
                radio2g: ['', Validators.required],
                radio2gDetails: this.fb.array([this.createRowqg()]),
            }),
            question8: this.fb.group({
                radio2h: ['', Validators.required],
                radio2hDetails: [''],
            })
        });
    }

    radioChanges() {
        this.form.get('question1.radio1a')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio1aDetails(value === 'Yes');
        });
        this.form.get('question2.radio1b')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio1bDetails,value === 'Yes');
            //this.updateValidatorsForRadio1bDetails(value === 'Yes');
        });
        this.form.get('question3.radio1c')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio1cDetails,value === 'Yes');
            //this.updateValidatorsForRadio1cDetails(value === 'Yes');
        });
        this.form.get('question4.radio1d')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio1dDetails,value === 'Yes');
            //this.updateValidatorsForRadio1dDetails(value === 'Yes');
        });
        this.form.get('question5.radio2e')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio2eDetails,value === 'Yes');
            //this.updateValidatorsForRadio2eDetails(value === 'Yes');
        });
        this.form.get('question6.radio2f')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio2fDetails,value === 'Yes');
           // this.updateValidatorsForRadio2fDetails(value === 'Yes');
        });
        this.form.get('question7.radio2g')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadioDetails(this.radio2gDetails,value === 'Yes');
           // this.updateValidatorsForRadio2gDetails(value === 'Yes');
        });
        this.form.get('question8.radio2h')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio2hDetails(value === 'Yes');
        });
    }
    applyConditionalValidators(question: string): void {
        switch (question) {
            case "qb": {
                const isYes = this.form.get('question2.radio1b')?.value === 'Yes';
                //this.updateValidatorsForRadio1bDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio1bDetails,isYes);
                break;
            }
            case "qc": {
                const isYes = this.form.get('question3.radio1c')?.value === 'Yes';
                //this.updateValidatorsForRadio1cDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio1cDetails,isYes);
                break;

            }
            case "qd": {
                const isYes = this.form.get('question4.radio1d')?.value === 'Yes';
                //this.updateValidatorsForRadio1dDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio1dDetails,isYes);
                break;

            }
            case "qe": {
                const isYes = this.form.get('question5.radio2e')?.value === 'Yes';
                //this.updateValidatorsForRadio2eDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio2eDetails,isYes);
                break;

            }
            case "qf": {
                const isYes = this.form.get('question6.radio2f')?.value === 'Yes';
                //this.updateValidatorsForRadio2fDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio2fDetails,isYes);
                break;
            }
            case "qg": {
                const isYes = this.form.get('question7.radio2g')?.value === 'Yes';
                //this.updateValidatorsForRadio2gDetails(isYes);
                this.updateValidatorsForRadioDetails(this.radio2gDetails,isYes);
                break;

            }
            default:
                break;
        }

    }
    updateValidatorsForRadio1aDetails(isYes: boolean): void {
        if(isYes){
        this.radio1aDetails?.setValidators(Validators.required);
        }
        else{
            this.radio1aDetails?.clearValidators();
        }
        this.radio1aDetails?.updateValueAndValidity();

    }
    updateValidatorsForRadio2hDetails(isYes: boolean): void {
        if(isYes){
        this.radio2hDetails?.setValidators(Validators.required);
        }
        else{
            this.radio2hDetails?.clearValidators();
        }
        this.radio2hDetails?.updateValueAndValidity();

    }
    updateValidatorsForRadioDetails(controlName:FormArray, isYes: boolean): void {
        controlName.controls.forEach((row) => {
            const rowGroup = row as FormGroup;
            if (isYes) {

                Object.keys(rowGroup.controls).forEach((controlName) => {
                    const control = row.get(controlName);
                    if (controlName === 'qbdate' || controlName === 'qcdate' || controlName === 'qddate' || controlName === 'qedate') { // Apply date validator only to 'dateField'
                        control?.setValidators([Validators.required, dateFormatValidator()]);
                    } else {
                        control?.setValidators(Validators.required);
                    }
                    //control?.setValidators(Validators.required);
                    control?.updateValueAndValidity();
                  });
               
            } else {
                Object.keys(rowGroup.controls).forEach((controlName) => {
                    const control = row.get(controlName);
                    control?.clearValidators();
                    control?.reset();
                    control?.updateValueAndValidity();
                  });
                
            }
            
        });
    }

    updateValidatorsForRadio1bDetails(isYes: boolean): void {
        this.radio1bDetails.controls.forEach((row) => {
            const rowGroup = row as FormGroup;
            if (isYes) {

                Object.keys(rowGroup.controls).forEach((controlName) => {
                    const control = row.get(controlName);
                    control?.setValidators(Validators.required);
                    control?.updateValueAndValidity();
                  });
               
            } else {
                Object.keys(rowGroup.controls).forEach((controlName) => {
                    const control = row.get(controlName);
                    control?.clearValidators();
                    control?.reset();
                    control?.updateValueAndValidity();
                  });
                
            }
            
        });
    }
    updateValidatorsForRadio1cDetails(isYes: boolean): void {
        this.radio1cDetails.controls.forEach((row) => {
            if (isYes) {

                row.get('qcname')?.setValidators(Validators.required);
                row.get('qcrelation')?.setValidators(Validators.required);
                row.get('qccomprelation')?.setValidators(Validators.required);
                row.get('qcdate')?.setValidators(Validators.required);
                row.get('qcclarifictaion')?.setValidators(Validators.required);
            } else {
                row.get('qcname')?.clearValidators();
                row.get('qcrelation')?.clearValidators();
                row.get('qccomprelation')?.clearValidators();
                row.get('qcdate')?.clearValidators();
                row.get('qcclarifictaion')?.clearValidators();
            }
            row.get('qcname')?.updateValueAndValidity();
            row.get('qcrelation')?.updateValueAndValidity();
            row.get('qccomprelation')?.updateValueAndValidity();
            row.get('qcdate')?.updateValueAndValidity();
            row.get('qcclarifictaion')?.updateValueAndValidity();
        });
    }

    updateValidatorsForRadio1dDetails(isYes: boolean): void {
        this.radio1dDetails.controls.forEach((row) => {
            if (isYes) {

                row.get('qdname')?.setValidators(Validators.required);
                row.get('qdrelation')?.setValidators(Validators.required);
                row.get('qdcomprelation')?.setValidators(Validators.required);
                row.get('qddate')?.setValidators(Validators.required);
                row.get('qddetails')?.setValidators(Validators.required);
            } else {
                row.get('qdname')?.clearValidators();
                row.get('qdrelation')?.clearValidators();
                row.get('qdcomprelation')?.clearValidators();
                row.get('qddate')?.clearValidators();
                row.get('qddetails')?.clearValidators();
            }
            row.get('qdname')?.updateValueAndValidity();
            row.get('qdrelation')?.updateValueAndValidity();
            row.get('qdcomprelation')?.updateValueAndValidity();
            row.get('qddate')?.updateValueAndValidity();
            row.get('qddetails')?.updateValueAndValidity();
        });
    }
    updateValidatorsForRadio2eDetails(isYes: boolean): void {
        this.radio2eDetails.controls.forEach((row) => {
            if (isYes) {
                row.get('qecompany')?.setValidators(Validators.required);
                row.get('qerelation')?.setValidators(Validators.required);
                row.get('qebenifit')?.setValidators(Validators.required);
                row.get('qedate')?.setValidators(Validators.required);
                row.get('qevalue')?.setValidators(Validators.required);
                row.get('qeremarks')?.setValidators(Validators.required);
            } else {
                row.get('qecompany')?.clearValidators();
                row.get('qerelation')?.clearValidators();
                row.get('qebenifit')?.clearValidators();
                row.get('qedate')?.clearValidators();
                row.get('qevalue')?.clearValidators();
                row.get('qeremarks')?.clearValidators();
            }
            row.get('qecompany')?.updateValueAndValidity();
            row.get('qerelation')?.updateValueAndValidity();
            row.get('qebenifit')?.updateValueAndValidity();
            row.get('qedate')?.updateValueAndValidity();
            row.get('qevalue')?.updateValueAndValidity();
            row.get('qeremarks')?.updateValueAndValidity();
            
        });
    }

    updateValidatorsForRadio2fDetails(isYes: boolean): void {
        this.radio2eDetails.controls.forEach((row) => {
            if (isYes) {
                row.get('qfcompany')?.setValidators(Validators.required);
                row.get('qfcomprelation')?.setValidators(Validators.required);
                row.get('qfservice')?.setValidators(Validators.required);
                row.get('qfdate')?.setValidators(Validators.required);
                row.get('qfclarification')?.setValidators(Validators.required);
            } else {
                row.get('qfcompany')?.clearValidators();
                row.get('qfcomprelation')?.clearValidators();
                row.get('qfservice')?.clearValidators();
                row.get('qfdate')?.clearValidators();
                row.get('qfclarification')?.clearValidators();
            }
            row.get('qfcompany')?.updateValueAndValidity();
            row.get('qfcomprelation')?.updateValueAndValidity();
            row.get('qfservice')?.updateValueAndValidity();
            row.get('qfdate')?.updateValueAndValidity();
            row.get('qfclarification')?.updateValueAndValidity();
        });
    }

    updateValidatorsForRadio2gDetails(isYes: boolean): void {
        this.radio2gDetails.controls.forEach((row) => {
            if (isYes) {
                row.get('qgname')?.setValidators(Validators.required);
                row.get('qgposition')?.setValidators(Validators.required);
                row.get('qgcompany')?.setValidators(Validators.required);
                row.get('qgrelation')?.setValidators(Validators.required);
                row.get('qgapproved')?.setValidators(Validators.required);
                row.get('qgclarification')?.setValidators(Validators.required);
            } else {
                row.get('qgname')?.clearValidators();
                row.get('qgposition')?.clearValidators();
                row.get('qgcompany')?.clearValidators();
                row.get('qgrelation')?.clearValidators();
                row.get('qgapproved')?.clearValidators();
                row.get('qgclarification')?.clearValidators();

            }
            row.get('qgname')?.updateValueAndValidity();
            row.get('qgposition')?.updateValueAndValidity();
            row.get('qgcompany')?.updateValueAndValidity();
            row.get('qgrelation')?.updateValueAndValidity();
            row.get('qgapproved')?.updateValueAndValidity();
            row.get('qgclarification')?.updateValueAndValidity();

        });
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

    addRowqb() {
        this.radio1bDetails.push(this.createRowqb());
        this.applyConditionalValidators("qb");
    }

    removeRowqb(index: number): void {
        if (this.radio1bDetails.length > 1) { // Prevent removing the last row if required
            this.radio1bDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
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

    addRowqc(): void {
        this.radio1cDetails.push(this.createRowqc());
        this.applyConditionalValidators("qc");
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
    removeRowqc(index: number): void {
        if (this.radio1cDetails.length > 1) { // Prevent removing the last row if required
            this.radio1cDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
    }

    addRowqd(): void {
        this.radio1dDetails.push(this.createRowqd());
        this.applyConditionalValidators("qd");
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
    removeRowqd(index: number): void {
        if (this.radio1dDetails.length > 1) { // Prevent removing the last row if required
            this.radio1dDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
    }

    addRowqe(): void {
        this.radio2eDetails.push(this.createRowqe());
        this.applyConditionalValidators("qe");
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
    removeRowqe(index: number): void {
        if (this.radio2eDetails.length > 1) { // Prevent removing the last row if required
            this.radio2eDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
    }

    addRowqf(): void {
        this.radio2fDetails.push(this.createRowqf());
        this.applyConditionalValidators("qf");
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
    removeRowqf(index: number): void {
        if (this.radio2fDetails.length > 1) { // Prevent removing the last row if required
            this.radio2fDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
    }
    addRowqg(): void {
        this.radio2gDetails.push(this.createRowqg());
        this.applyConditionalValidators("qg");
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
    removeRowqg(index: number): void {
        if (this.radio2gDetails.length > 1) { // Prevent removing the last row if required
            this.radio2gDetails.removeAt(index);
        } else {
            alert('At least one row is required.');
        }
    }

    onSubmit() {
        const formValue = this.form.value;
        //const question1 = this.form.get('question1.radio1a');
        const radioAgreement=this.form.get('radioAgreement')
        const question1 = this.form.get('question1.radio1a');
        const question2 = this.form.get('question2.radio1b');
        const question3 = this.form.get('question3.radio1c');
        const question4 = this.form.get('question4.radio1d');
        const question5 = this.form.get('question5.radio2e');
        const question6 = this.form.get('question6.radio2f');
        const question7 = this.form.get('question7.radio2g');
        const question8 = this.form.get('question8.radio2h');
		
		const question1d = this.form.get('question1.radio1aDetails');
        const question2d = this.form.get('question2.radio1bDetails');
        const question3d = this.form.get('question3.radio1cDetails');
        const question4d = this.form.get('question4.radio1dDetails');
        const question5d = this.form.get('question5.radio2eDetails');
        const question6d = this.form.get('question6.radio2fDetails');
        const question7d = this.form.get('question7.radio2gDetails');
        const question8d = this.form.get('question8.radio2hDetails');

       // console.log(formValue);
        if (formValue.radioAgreement === 'No' ) {
            swal('','Please accept the declaration as "Yes"','info');
            return;
          }
          if (radioAgreement?.invalid || question1?.invalid || question2?.invalid || question3?.invalid || question4?.invalid 
            || question5?.invalid || question6?.invalid || question7?.invalid || question8?.invalid

          ) {
            swal('','Please fill all the Mandatory fields','info');
            return;
          }
          if (question1d?.invalid) {
            swal('','Please give an explanation for Q.a','info');
            return;
          }
      
          if (question2d?.invalid)
          {
            swal('','Please give an explanation for Q.b','info');
            return;
          }
          if (question3d?.invalid)
            {
              swal('','Please give an explanation for Q.c','info');
              return;
            }
            if (question4d?.invalid)
                {
                  swal('','Please give an explanation for Q.d','info');
                  return;
                }
                if (question5d?.invalid)
                    {
                      swal('','Please give an explanation for Q.e','info');
                      return;
                    }
                    if (question6d?.invalid)
                        {
                          swal('','Please give an explanation for Q.f','info');
                          return;
                        }
                        if (question7d?.invalid)
                            {
                              swal('','Please give an explanation for Q.g','info');
                              return;
                            }
                            if (question8d?.invalid)
                                {
                                  swal('','Please give an explanation for Q.h','info');
                                  return;
                                }
        this.form.get('employeeDetails')?.disable();
        this.form.get('comments')?.disable();
        this.form.updateValueAndValidity();
       // this.checkFullFormValidity(this.form);
        if(this.form.invalid){
            swal('','INVALID FORM','info');
            return;
        }
        const radio1bDetailsArray = this.radio1bDetails;
        const radio1cDetailsArray = this.radio1cDetails;
        const radio1dDetailsArray = this.radio1dDetails;
        const radio2eDetailsArray = this.radio2eDetails;
        const radio2fDetailsArray = this.radio2fDetails;
        const radio2gDetailsArray = this.radio2gDetails;
        let QuestionBComment = '[';
        let QuestionCComment = '[';
        let QuestionDComment = '[';
        let QuestionEComment = '[';
        let QuestionFComment = '[';
        let QuestionGComment = '[';
        radio1bDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{"qbname${index + 1}":"${rowValue.qbname}","qbrelation${index + 1}":"${rowValue.qbrelation}","qbbenifit${index + 1}":"${rowValue.qbbenifit}","qbdate${index + 1}":"${rowValue.qbdate}","qbvalue${index + 1}":"${rowValue.qbvalue}","qbremarks${index + 1}":"${rowValue.qbremarks || ''}"}`;
            QuestionBComment += rowJson + (index < radio1bDetailsArray.length - 1 ? ',' : '');
        });
        QuestionBComment += ']';

        radio1cDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{"qcname${index + 1}":"${rowValue.qcname}","qcrelation${index + 1}":"${rowValue.qcrelation}","qccomprelation${index + 1}":"${rowValue.qccomprelation}","qcdate${index + 1}":"${rowValue.qcdate}","qcclarifictaion${index + 1}":"${rowValue.qcclarifictaion}"}`;
            QuestionCComment += rowJson + (index < radio1cDetailsArray.length - 1 ? ',' : '');
        });
        QuestionCComment += ']';

        radio1dDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{"qdname${index + 1}":"${rowValue.qdname}","qdrelation${index + 1}":"${rowValue.qdrelation}","qdcomprelation${index + 1}":"${rowValue.qdcomprelation}","qddate${index + 1}":"${rowValue.qddate}","qddetails${index + 1}":"${rowValue.qddetails}"}`;
            QuestionDComment += rowJson + (index < radio1dDetailsArray.length - 1 ? ',' : '');
        });
        QuestionDComment += ']';

        radio2eDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{"qecompany${index + 1}":"${rowValue.qecompany}","qerelation${index + 1}":"${rowValue.qerelation}","qebenifit${index + 1}":"${rowValue.qebenifit}","qedate${index + 1}":"${rowValue.qedate}","qevalue${index + 1}":"${rowValue.qevalue}","qeremarks${index + 1}":"${rowValue.qeremarks}"}`;
            QuestionEComment += rowJson + (index < radio2eDetailsArray.length - 1 ? ',' : '');
        });
        QuestionEComment += ']';

        radio2fDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{
              "qfcompany${index + 1}":"${rowValue.qfcompany}","qfcomprelation${index + 1}":"${rowValue.qfcomprelation}","qfservice${index + 1}":"${rowValue.qfservice}","qfdate${index + 1}":"${rowValue.qfdate}","qfclarification${index + 1}":"${rowValue.qfclarification}"}`;
            QuestionFComment += rowJson + (index < radio2fDetailsArray.length - 1 ? ',' : '');
        });
        QuestionFComment += ']';

        radio2gDetailsArray.controls.forEach((row, index) => {
            const rowValue = row.value;
            const rowJson = `{"qgname${index + 1}":"${rowValue.qgname}","qgposition${index + 1}":"${rowValue.qgposition}","qgcompany${index + 1}":"${rowValue.qgcompany}","qgrelation${index + 1}":"${rowValue.qgrelation}","qgapproved${index + 1}":"${rowValue.qgapproved}","qgclarification${index + 1}":"${rowValue.qgclarification}"}`;
            QuestionGComment += rowJson + (index < radio2gDetailsArray.length - 1 ? ',' : '');
        });
        QuestionGComment += ']';

        const finalData = {
            Agree: this.form.get('radioAgreement')?.value,
            QuestionA: this.form.get('question1')?.get('radio1a')?.value,
            QuestionB: this.form.get('question2')?.get('radio1b')?.value,
            QuestionC: this.form.get('question3')?.get('radio1c')?.value,
            QuestionD: this.form.get('question4')?.get('radio1d')?.value,
            QuestionE: this.form.get('question5')?.get('radio2e')?.value,
            QuestionF: this.form.get('question6')?.get('radio2f')?.value,
            QuestionG: this.form.get('question7')?.get('radio2g')?.value,
            QuestionH: this.form.get('question8')?.get('radio2h')?.value,
            QuestionAComment: this.form.get('question1')?.get('radio1aDetails')?.value,
            QuestionBComment: QuestionBComment,
            QuestionCComment: QuestionCComment,
            QuestionDComment: QuestionDComment,
            QuestionEComment: QuestionEComment,
            QuestionFComment: QuestionFComment,
            QuestionGComment: QuestionGComment,
            QuestionHComment: this.form.get('question8')?.get('radio2hDetails')?.value,
            Status: "Submitted",
            Stage: "New",
            Level: "LM",
            Attachments:(this.file?.length > 0) ? this.file[0]:null
        }
        this.service.AddCOI(finalData).then((res) => {
           
            if(res.data){
            
            swal(
                '',
                'Thank you for submiting Conflict of Interest',
                'success'
            ).then(function () {
               window.location.reload();
            })}
            this.myModal = false;
            this.readOnly = false;
            this.CreateForm();
        });
    }
    file:any;
    onFileSelected(event: any) {
        const files: FileList = event.target.files;
        if (files.length > 0) {
          this.file = files; // Get the first file (if multiple files selected, use loop to handle all)
        }
      }
      uploadthefiles(itemId:any, file:any) {
        var getFileBuffer = function (file:any) {

            var deferred = $.Deferred();
            var reader = new FileReader();

            reader.onload = function (e:any) {
                deferred.resolve(e.target.result);
            }

            reader.onerror = function (e:any) {
                deferred.reject(e.target.error);
            }

            reader.readAsArrayBuffer(file);

            return deferred.promise();
        };

        getFileBuffer(file).then(function (buffer) {
            //const requestDigest = this.service.getRequestDigest();
            // if (!requestDigest) {
            //   console.error("Could not retrieve X-RequestDigest.");
            //   return;
            // }
            $.ajax({
                url:  environment.sp_URL +
                    "/_api/web/lists/getbytitle('COIHolding2025')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + file.name + "')",
                method: 'POST',
                data: buffer,
                processData: false,
                async: false,
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "content-type": "application/json; odata=verbose",
                    //"X-RequestDigest":requestDigest
                },
                success: function (filedata:any) {	
					//$.LoadingOverlay("hide");				
                    swal(
						'',
						'Thank you for submiting Conflict of Interest',
						'success'
						).then(function () {
							//window.location.reload();
					})
                },
                error: function (error:any) {
                   console.error(error);
                }
            });

        });
    }
    
    getMytasksCOIData() {
       // this.service.getUserName().subscribe(res => {
            if (this.user != null) {
               // let user = res as any;
                this.service.getMytasksCOIData(this.user.d.Email).subscribe(data => {
                    var dataset1 = data as any;
                    this.spnmytasks=dataset1.value.length;
                    //console.log(dataset1.value.length);
                    //var currentUserId = _spPageContextInfo.userId;
                    const table: any = $("#mytasks");
                    table.DataTable({
                        destroy: true,
                        "order": [[0, "desc"]],
                        "aLengthMenu": [[6, 12, 30, -1], [6, 12, 30, "All"]],
                        "iDisplayLength": 6,
                        data: dataset1.value,
                        "columns": [
                            {
                                "data": "ID", "class": "hide",
                            },
                            { "data": "EmployeeName" },
                            { "data": "EmployeeEmail" },
                            {
                                "orderable": false,
                                "data": null,
                                "defaultContent": '',
                                "render": function (e: any) {
                                    if (e.Created != null) {
                                        return new Date(e.Created).toLocaleDateString();
                                    } else {
                                        return "";
                                    }
                                }
                            },
                            { "data": "Status" },

                            {
                                "class": 'control',
                                "orderable": false,
                                "data": null,
                                "defaultContent": '',
                                "render": function (e: any) { return `<a href="javascript:void(0);" class="approve_task" data-id="${e.ID}">View</a>`; }
                            },

                        ]
                    });

                    // Listen for clicks on the 'View' button
                    $('#mytasks tbody').on('click', '.approve_task', (event: any) => {
                        //const taskId = $(event.currentTarget).data('Id');
                        const taskId = $(event.target).data('id');
                        if (taskId) {
                            const selectedRow = dataset1.value.find((item: any) => item.ID === taskId);
                            if (selectedRow) {
                                this.router.navigate(['/coi', taskId]); 
                                // this.dialog.open(TaskApproveComponent, {
                                //     width: '90%', // Optional: Set modal width
                                //     height: '90%',
                                //     data: { id: taskId, row: selectedRow }, // Pass the TaskID to the modal component
                                // });
                            }
                            else {
                                console.error('Task invalid!');
                            }
                        } else {
                            console.error('TaskID is undefined or invalid!');
                        }
                         this.router.navigate(['/coi', taskId]);
                    });
                });
            }
       // });
    }
    onMyTasksClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('profile');
        event.preventDefault();
        this.getMytasksCOIData();
        this.cd.detectChanges();
    }
    onCEOTasksClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('ceopending');
        event.preventDefault();
        this.getMytaskCEOData();
        this.cd.detectChanges();
    }
    onCEOTasksCompletedClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('ceocompleted');
        event.preventDefault();
        this.getMytaskCEOCompletedData();
        this.cd.detectChanges();
    }
    onAllcoiTasksCompletedClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('allcoicompleted');
        event.preventDefault();
        this.getAllCOICompletedData('Holding');
        this.cd.detectChanges();
    }
    onAllcoilsTasksCompletedClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('allcoicompletedls');
        event.preventDefault();
        this.getAllCOICompletedData('Lifestyle');
        this.cd.detectChanges();
    }
    onAllcoigsTasksCompletedClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('allcoicompletedgs');
        event.preventDefault();
        this.getAllCOICompletedData('Global Solutions');
        this.cd.detectChanges();
    }
    onAllcoiretailTasksCompletedClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('allcoicompletedretail');
        event.preventDefault();
        this.getAllCOICompletedData('Retail');
        this.cd.detectChanges();
    }

    
    onDeclaredCOIClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('declaredCOI');
        event.preventDefault();
        this.getDeclaredCOI();
        this.cd.detectChanges();
    }
    onRetailDeclaredCOIClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('declaredCOIretail');
        event.preventDefault();
        this.getDeclaredCOIRetail();
        this.cd.detectChanges();
    }
    onGSDeclaredCOIClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('declaredCOIGS');
        event.preventDefault();
        this.getDeclaredCOIGS();
        this.cd.detectChanges();
    }

    onLSDeclaredCOIClick(event: Event): void {
        this.myModal = false;
        this.readOnly = false;
        this.setActiveTab('declaredCOILS');
        event.preventDefault();
        this.getDeclaredCOILS();
        this.cd.detectChanges();
    }
   

    onSubmitCOIClick(event: Event): void {
        this.setActiveTab('home');
        event.preventDefault();
        this.initialiazeDatatable(this.user.d.Id);
        this.cd.detectChanges();
    }
    onOpcoChange(event: Event) {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.getAllCOICompletedData(selectedValue);
        this.cd.detectChanges();
        //alert("Selected OPCO:"+ selectedValue);
        
        // Perform any action based on the selected value
      }
    isUserMember(groupName:any,userId:any){
       this.service.isUserMember(groupName,userId).subscribe((data:any)=>{
        if(data.d.results[0] != undefined){
            //User is a Member, do something or return true
               this.mytasksceo=true;
               this.mycompletedtasksceo=true;
            }
       });
       
        
    }
    isUserMemberCO(groupName:any,userId:any){
        this.service.isUserMember(groupName,userId).subscribe((data:any)=>{
         if(data.d.results[0] != undefined){
             //User is a Member, do something or return true
             this.mycompletedtasksco = true;
             this.mycompletedtasksstatus =true;
             }
        });
        
         
     }
     isUserMemberCOLS(){
        this.service.isUserMember('LSCompliance',this.userId).subscribe((data:any)=>{
            if(data.d.results[0] != undefined){
                this.mycompletedtaskscols=true;
            }
            });
        }
        isUserMemberCOGS(){
            this.service.isUserMember('GSCompliance',this.userId).subscribe((data:any)=>{
                if(data.d.results[0] != undefined){
                    this.mycompletedtaskscogs=true;
                }
                });
            }
            isUserMemberCOGSRetail(){
                this.service.isUserMember('RetailCompliance',this.userId).subscribe((data:any)=>{
                    if(data.d.results[0] != undefined){
                        this.mycompletedtaskscoretail=true;
                    }
                    });
                }
    getMytaskCEOData(){
       this.service.getMytasksCEOData(this.user.d.Email).subscribe((ceodata:any)=>{
        var dataset1 = ceodata as any;
        this.spnmytasksceo=dataset1.value.length;
        //var currentUserId = _spPageContextInfo.userId;
        const table: any = $("#mytasksceotbl");
         table.DataTable({
            destroy: true, "order": [[0, "desc"]],
            "aLengthMenu": [[6, 12, 30, -1], [6, 12, 30, "All"]],
            "iDisplayLength": 6,
            data: dataset1.value,
            "columns": [
                 {
                     "data": "ID", "class": "hide",
                 },
                { "data": "EmployeeName" },
                { "data": "EmployeeEmail" },
                {
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) {
                        if (e.Created != null) {
                            return new Date(e.Created).toLocaleDateString();
                        } else {
                            return "";
                        }
                    }
                },
                { "data": "Status" },

                {
                    "class": 'control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e: any) { return `<a href="javascript:void(0);" class="approve_task" data-id="${e.ID}">View</a>`; }
                },

            ]
        });
        $('#mytasksceotbl tbody').on('click', '.approve_task', (event: any) => {
            //const taskId = $(event.currentTarget).data('Id');
            const taskId = $(event.target).data('id');
            if (taskId) {
                const selectedRow = dataset1.value.find((item: any) => item.ID === taskId);
                if (selectedRow) {

                    this.dialog.open(TaskApproveComponent, {
                        width: '90%', // Optional: Set modal width
                        height: '90%',
                        data: { id: taskId, row: selectedRow }, // Pass the TaskID to the modal component
                    });
                }
                else {
                    console.error('Task invalid!');
                }
            } else {
                console.error('TaskID is undefined or invalid!');
            }
            // this.router.navigate(['/task-approve', taskId]);
        });
    })
   }
   ongetCOIReports(event:any){
    this.myModal = false;
    this.readOnly = false;
    this.setActiveTab('declaredCOIReport');
    this.router.navigate(['/report']);
    event.preventDefault();
    this.cd.detectChanges();
   }
getAllCOICount(){
    this.service.getRecordCount().subscribe(res=>{
        var count=res as any;
     this.spnmytaskscompletedco =count.d.results.length;
    });
    //console.log(count);
    //
}
   getMytaskCEOCompletedData(){
    this.service.getMytasksCEOCompletedData().subscribe((ceodata:any)=>{
     var dataset1 = ceodata as any;
     this.spnmytaskscompletedceo = dataset1.value.length;
     this.cd.detectChanges();
     //var currentUserId = _spPageContextInfo.userId;
     const table: any = $("#mytaskscompletedceo");
      table.DataTable({
         destroy: true, "order": [[0, "desc"]],
         "aLengthMenu": [[6, 12, 30, -1], [6, 12, 30, "All"]],
         "iDisplayLength": 6,
         data: dataset1.value,
         "columns": [
              {
                  "data": "ID", "class": "hide",
              },
             { "data": "EmployeeName" },
             { "data": "EmployeeEmail" },
             {
                 "orderable": false,
                 "data": null,
                 "defaultContent": '',
                 "render": function (e:any) {
                     if (e.Created != null) {
                         return new Date(e.Created).toLocaleDateString();
                     } else {
                         return "";
                     }
                 }
             },
             { "data": "Status" },

             {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e: any) {
                    var status_html = "";
                    if (e.ID != null) {
                        status_html = '<a style="padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;" data-task="' + e.ID + '" data-tab="myrequest" class="anc_task">View</a>';
                        return status_html;

                    } else {
                        return "";
                    }
                }
            },

         ]
     });
     $('#mytaskscompletedceo tbody').on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
 })
}
getAllCOICompletedData(opco:string){
    this.service.getAllCOICompletedData(opco).subscribe((allcoidata:any)=>{
     var dataset1 = allcoidata as any;
     
     let table: any; // = $("#mytaskscompletedcotbl");
     let tableId:any;
     //var currentUserId = _spPageContextInfo.userId;
     switch(opco){
        case "Holding":{
            table= $("#mytaskscompletedcotbl");
            tableId="mytaskscompletedcotbl";
           // this.spnmytaskscompletedco =dataset1.value.length;
            break;
        }
        case "Lifestyle":{
            table= $("#mytaskscompletedstatustblls");
            tableId="mytaskscompletedstatustblls";
            this.spnmytaskscompletedcols =dataset1.value.length;
            break;
        }
        case "Global Solutions":{
            table= $("#mytaskscompletedstatustblgs");
            tableId="mytaskscompletedstatustblgs";
            this.spnmytaskscompletedcogs =dataset1.value.length;
            break;
        }
        case "Retail":{
            table= $("#mytaskscompletedstatustblretail");
            tableId="mytaskscompletedstatustblretail";
            this.spnmytaskscompletedcoretail =dataset1.value.length;
            break;
        }
     }
     if(this.activeTab == 'allcoicompleted'){
        table= $("#mytaskscompletedcotbl");
        tableId="mytaskscompletedcotbl";

     }
     
      table.DataTable({
         destroy: true, "order": [[0, "desc"]],
         "aLengthMenu": [[6, 12, 30, -1], [6, 12, 30, "All"]],
         "iDisplayLength": 6,
         data: dataset1.value,
         "columns": [
              {
                  "data": "ID", "class": "hide",
              },
             { "data": "EmployeeName" },
             { "data": "EmployeeEmail" },
             {
                 "orderable": false,
                 "data": null,
                 "defaultContent": '',
                 "render": function (e:any) {
                     if (e.Created != null) {
                         return new Date(e.Created).toLocaleDateString();
                     } else {
                         return "";
                     }
                 }
             },
             {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e:any) {
                   var status_html = "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>"+e.Status+"<span>";
                    return status_html;
                }
            },

            {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e: any) {
                    var status_html = "";
                    if (e.ID != null) {
                        status_html = '<a style="padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;" data-task="' + e.ID + '" data-tab="myrequest" class="anc_task">View</a>';
                        return status_html;

                    } else {
                        return "";
                    }
                }
            },

         ]
     });
     
     $(`#${tableId} tbody`).on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
 })
}
getDeclaredCOI(){
    this.service.getDeclaredCOI().subscribe((declaredcoi:any)=>{
        var dataset1 = declaredcoi as any;
        this.spndeclaredcoi=dataset1.value.length;
        const table: any = $("#mytaskscompletedstatustbl");
        table.DataTable({
            destroy: true,
            "order": [[ 0, "desc" ]],
            "aLengthMenu": [[20, 40, 60, -1], [20, 40, 60, "All"]],
            "iDisplayLength": 20,
            "data": dataset1.value,
            "columns": [
            {
                "data": "ID","class": "hide",
            },

                { "data": "EmployeeName" },
                { "data": "EmployeeEmail" },               
                {
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) {
                        if (e.Created != null) {
                            return new Date(e.Created).toLocaleDateString();
                        } else {
                            return "";
                        }
                    }
                },
                   {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e:any) {
                   
                           var status_html = "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>"+e.Status+"<span>";
                                                    return status_html;

                                        }
            },

                 
                {
                    "class": 'control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) { 
                        return '<a data-task="'+ e.Id +'" data-tab="others" class="anc_task">View</a>'; 
                    
                    }
                },

            ]
            
       });
       $("#mytaskscompletedstatustbl tbody").on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
    });
}

getDeclaredCOIRetail(){
    this.service.getDeclaredCOIRetail().subscribe((declaredcoiretail:any)=>{
        var dataset1 = declaredcoiretail as any;
        this.spndeclaredcoiretail=dataset1.value.length;
        const table: any = $("#mytaskscompletedstatustblretail");
        table.DataTable({
            destroy: true,"order": [[ 0, "desc" ]],
            "aLengthMenu": [[20, 40, 60, -1], [20, 40, 60, "All"]],
            "iDisplayLength": 20,
            "data": dataset1.value,
            "columns": [
            {
                "data": "ID","class": "hide",
            },

                { "data": "EmployeeName" },
                { "data": "EmployeeEmail" },               
                {
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) {
                        if (e.Created != null) {
                            return new Date(e.Created).toLocaleDateString();
                        } else {
                            return "";
                        }
                    }
                },
                   {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e:any) {
                   
                           var status_html = "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>"+e.Status+"<span>";
                                                    return status_html;

                                        }
            },

                 
                {
                    "class": 'control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) { 
                        return '<a  data-task="'+ e.Id +'" data-tab="others" class="anc_task">View</a>'; 
                    
                    }
                },

            ]
            
       });
       $("#mytaskscompletedstatustblretail tbody").on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
    });
    
}
getDeclaredCOIGS(){
    this.service.getDeclaredCOIGS().subscribe((declaredcoigs:any)=>{
        var dataset1 = declaredcoigs as any;
        this.spndeclaredcoigs = dataset1.value.length;
        const table: any = $("#mytaskscompletedstatustblglobalsolutions");
        table.DataTable({
            destroy: true,"order": [[ 0, "desc" ]],
            "aLengthMenu": [[20, 40, 60, -1], [20, 40, 60, "All"]],
            "iDisplayLength": 20,
            "data": dataset1.value,
            "columns": [
            {
                "data": "ID","class": "hide",
            },

                { "data": "EmployeeName" },
                { "data": "EmployeeEmail" },               
                {
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) {
                        if (e.Created != null) {
                            return new Date(e.Created).toLocaleDateString();
                        } else {
                            return "";
                        }
                    }
                },
                   {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e:any) {
                   
                           var status_html = "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>"+e.Status+"<span>";
                                                    return status_html;

                                        }
            },

                 
                {
                    "class": 'control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) { 
                        return '<a data-task="'+ e.Id +'" data-tab="others" class="anc_task">View</a>'; 
                    
                    }
                },

            ]
            
       });
       $("#mytaskscompletedstatustblglobalsolutions tbody").on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
    });
    
}


getDeclaredCOILS(){
    this.service.getDeclaredCOILS().subscribe((declaredcoigs:any)=>{
        var dataset1 = declaredcoigs as any;
        this.spndeclaredcoils = dataset1.value.length;
        const table: any = $("#mytaskscompletedstatustblls");
        table.DataTable({
            destroy: true,"order": [[ 0, "desc" ]],
            "aLengthMenu": [[20, 40, 60, -1], [20, 40, 60, "All"]],
            "iDisplayLength": 20,
            "data": dataset1.value,
            "columns": [
            {
                "data": "ID","class": "hide",
            },

                { "data": "EmployeeName" },
                { "data": "EmployeeEmail" },               
                {
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) {
                        if (e.Created != null) {
                            return new Date(e.Created).toLocaleDateString();
                        } else {
                            return "";
                        }
                    }
                },
                   {
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function (e:any) {
                   
                           var status_html = "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>"+e.Status+"<span>";
                                                    return status_html;

                                        }
            },

                 
                {
                    "class": 'control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": '',
                    "render": function (e:any) { 
                        return '<a data-task="'+ e.Id +'" data-tab="others" class="anc_task">View</a>'; 
                    
                    }
                },

            ]
            
       });
       $("#mytaskscompletedstatustblls tbody").on('click', '.anc_task', (event) => {
        const rowData = $(event.currentTarget).closest('tr').data();
        const taskId = $(event.currentTarget).data('task');

        // Find the row data using taskId
        const selectedRow = dataset1.value.find((item:any) => item.ID === taskId);
        if (selectedRow) {
            this.viewCOI(taskId);
        }
        
    });
    });
    
}
}

