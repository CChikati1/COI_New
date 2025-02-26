import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import 'daterangepicker';
// import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-responsive';
import { MatDialogModule } from '@angular/material/dialog'; //MAT_DIALOG_DATA, MatDialog, 
import { provideAnimations } from '@angular/platform-browser/animations';
import swal from 'sweetalert';
import { environment } from '../../environments/environment';
import html2pdf from 'html2pdf.js';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-coi-report',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, FormsModule],
  providers: [
    provideAnimations(), MatDialogModule
  ],
  templateUrl: './coi-report.component.html',
  styleUrl: './coi-report.component.scss'
})


export class CoiReportComponent {
 
  @ViewChild('reportrange', { static: false }) dateRangePicker!: ElementRef;
  startDate!: moment.Moment;
  endDate!: moment.Moment;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef,
    public service: ApiService,

  ) { }
  goBack() {
    this.router.navigate(['/']); // Navigate back to the task list
  }

	isValidJson(jsonData:any) {
		try {
			JSON.parse(jsonData);
			return true;
		} catch (error) {
			return false;
		}
	}

	 cb(start:any, end:any) {
		$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		this.startDate = start;
		this.endDate =  end;
	}
  user:any;
  userId:any;
  userName:any;
  email:any;
  ngOnInit(): void {
   
    this.service.getUserName().subscribe(res => {
        if (res != null) {
            let user = res as any;
            this.user=user;
            this.userId=user.d.Id;
            this.userName=user.d.Title;
            this.email=user.d.Email;
            this.getData(this.email);
            this.cd.detectChanges();
        }
    });
    
}
getData(user:any){
  this.startDate = moment().subtract(29, 'days');
  this.endDate = moment();

  const cb = (start: moment.Moment, end: moment.Moment) => {
    this.startDate = start;
    this.endDate = end;
    console.log('Selected Range:', start.format('YYYY-MM-DD'), 'to', end.format('YYYY-MM-DD'));
  };

  $(this.dateRangePicker.nativeElement).daterangepicker(
    {
      startDate: this.startDate,
      endDate: this.endDate,
      showDropdowns: true,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [
          moment().subtract(1, 'month').startOf('month'),
          moment().subtract(1, 'month').endOf('month')
        ]
      },
      locale: { customRangeLabel: 'Custom Range' }
    },
    cb
  );

  // Handle apply event
  $(this.dateRangePicker.nativeElement).on('apply.daterangepicker', (ev: any, picker: any) => {
    cb(picker.startDate, picker.endDate);
  });
  let listUrl = environment.sp_URL + "/_api/web/lists/getByTitle('EmployeeManagerMapping2025')/items?$select=*,Author/Title,Editor/Title&$filter=EmployeeEmail eq '" + user + "'&$expand=Author,Editor&$top=1";

		$.ajax({
			url: listUrl,
			method: "GET",
			headers: {
				"Accept": "application/json; odata=verbose"
			},
			success: function(data:any) {
				var listData = data.d.results;
        console.log(data.d.results);
				if(listData!=null && listData[0]!=null){
					if( user=="Chandana.Chikati1-e@maf.ae" ){
						$('#optOPCO').append(new Option("All", "All"));
						$('#optOPCO').append(new Option("Global Solutions", "Global Solutions"));
						$('#optOPCO').append(new Option("Holding", "Holding"));
						$('#optOPCO').append(new Option("Lifestyle", "Lifestyle"));
						$('#optOPCO').append(new Option("Retail", "Retail"));
						$('#optOPCO').append(new Option("Xsight Future Solution", "Xsight Future Solution"));
					}else{
						$('#optOPCO').append(new Option(listData[0].OPCO, listData[0].OPCO));
					}
				}
				else{
					if( user=="Chandana.Chikati1-e@maf.ae"){
						$('#optOPCO').append(new Option("All", "All"));
						$('#optOPCO').append(new Option("Global Solutions", "Global Solutions"));
						$('#optOPCO').append(new Option("Holding", "Holding"));
						$('#optOPCO').append(new Option("Lifestyle", "Lifestyle"));
						$('#optOPCO').append(new Option("Retail", "Retail"));
						$('#optOPCO').append(new Option("Xsight Future Solution", "Xsight Future Solution"));
					}
				}
			},
			error: function(error:any) {
				console.log("Error fetching data: " + error);
			}
		})
}


    fn_submit():void {
		var optOPCO = $('#optOPCO').val();
		var FromDate1 = this.startDate;
		var ToDate1 = this.endDate;
		
		let FromDate_ = moment(FromDate1).format("YYYY-MM-DD");
		var FromDate:any = FromDate_+'T00:00:00.000Z';

		let ToDate_ = moment(ToDate1).format("YYYY-MM-DD");
		var ToDate:any = ToDate_+'T23:59:59.000Z';
		if(optOPCO==""){
			alert("Please select OPCO");
			return;
		}
		if(optOPCO!=""){
			// $.LoadingOverlay("show", {
			// 	imageAnimation: "",
			// 	image: "/Compliance/SiteAssets/Maffload.gif"
			// });
			var listUrl="";
			if(optOPCO=="All"){
				listUrl = environment.sp_URL + "/_api/web/lists/getByTitle('COIHolding2025')/items?$select=*,Author/Title,Editor/Title&$filter=Created ge datetime'" + FromDate + "' and Created le datetime'" + ToDate + "'&$expand=Author,Editor&$top=50000";
			}
			else{
				// SharePoint list endpoint URL
				listUrl = environment.sp_URL + "/_api/web/lists/getByTitle('COIHolding2025')/items?$select=*,Author/Title,Editor/Title&$filter=Created ge datetime'" + FromDate + "' and Created le datetime'" + ToDate + "' and OPCO eq '" + optOPCO + "'&$expand=Author,Editor&$top=50000";
			}
			// Fetch data from SharePoint list
			$.ajax({
				url: listUrl,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose"
				},
				success: function(data:any) {
					var listData = data.d.results;
            if(listData.length == 0){
              alert("No data found");
              return;
            }
            else{
					// listData.map(function(item) {
					// 	if (isValidJson(item.QuestionGComment)) {
					// 		console.log("JSON is valid");
					// 	} else {
					// 		console.log("JSON is invalid");
					// 	}
					// });

					// Specify the columns you want to include in the Excel file
					var columnsToInclude = ['ID', 'CreatedBy','ModifiedBy','Created','Modified', 'EmployeeName', 'EmployeeEmail', 'EmployeeNumber','ManagerNumber','ManagerName','ManagerEmail','OPCO','DeptHeadEmail','DeptHeadName','Approver','PendingWith','Status','AssignedTo','WorkflowStatus','Level','Stage','WorkflowTrigger','ApproverLevel','cLevel','ComplianceEmail','ComplianceName','Company','Department','Designation','Agree','QuestionA','QuestionAComment'
					,'QuestionB','QuestionBComment','qbname1','qbrelation1','qbbenifit1','qbdate1','qbvalue1','qbremarks1','qbname2','qbrelation2','qbbenifit2','qbdate2','qbvalue2','qbremarks2','qbname3','qbrelation3','qbbenifit3','qbdate3','qbvalue3','qbremarks3','qbname4','qbrelation4','qbbenifit4','qbdate4','qbvalue4','qbremarks4'
					,'QuestionC','QuestionCComment','qcname1','qcrelation1','qccomprelation1','qcdate1','qcclarifictaion1','qcname2','qcrelation2','qccomprelation2','qcdate2','qcclarifictaion2','qcname3','qcrelation3','qccomprelation3','qcdate3','qcclarifictaion3','qcname4','qcrelation4','qccomprelation4','qcdate4','qcclarifictaion4'
					,'QuestionD','QuestionDComment','qdname1','qdrelation1','qdcomprelation1','qddate1','qddetails1','qdname2','qdrelation2','qdcomprelation2','qddate2','qddetails2','qdname3','qdrelation3','qdcomprelation3','qddate3','qddetails3','qdname4','qdrelation4','qdcomprelation4','qddate4','qddetails4'
					,'QuestionE','QuestionEComment','qecompany1','qerelation1','qebenifit1','qedate1','qevalue1','qeremarks1','qecompany2','qerelation2','qebenifit2','qedate2','qevalue2','qeremarks2','qecompany3','qerelation3','qebenifit3','qedate3','qevalue3','qeremarks3','qecompany4','qerelation4','qebenifit4','qedate4','qevalue4','qeremarks4'
					,'QuestionF','QuestionFComment','qfcompany1','qfcomprelation1','qfservice1','qfdate1','qfclarification1','qfcompany2','qfcomprelation2','qfservice2','qfdate2','qfclarification2','qfcompany3','qfcomprelation3','qfservice3','qfdate3','qfclarification3','qfcompany4','qfcomprelation4','qfservice4','qfdate4','qfclarification4'
					,'QuestionG','QuestionGComment','qgname1','qgposition1','qgcompany1','qgrelation1','qgapproved1','qgclarification1','qgname2','qgposition2','qgcompany2','qgrelation2','qgapproved2','qgclarification2','qgname3','qgposition3','qgcompany3','qgrelation3','qgapproved3','qgclarification3','qgname4','qgposition4','qgcompany4','qgrelation4','qgapproved4','qgclarification4'
					,'QuestionH','QuestionHComment','DHComments','ManagerComments','RACComments','OPCOHComments','OPCOCHComments'];
					
					var filteredListData:any = [];

					var exists = listData.some(function(item:any) {
						return item.ID === 2058;
					});

					if (exists) {
						console.log("ID 2058 exists in listData");
					} else {
						console.log("ID 2058 does not exist in listData");
					}
					
					listData.map(function(item:any) {

						var tempfilteredListData=[];

						var qaJSON=[];var qbJSON:any=[];var qcJSON:any=[];var qdJSON:any=[];var qeJSON:any=[];var qfJSON:any=[];var qgJSON:any=[];var qhJSON:any=[];

						var qbname1 = "";var qbrelation1 = "";var qbbenifit1 = "";var qbdate1 = "";var qbvalue1 = "";var qbremarks1 = "";
						var qbname2 = "";var qbrelation2 = "";var qbbenifit2 = "";var qbdate2 = "";var qbvalue2 = "";var qbremarks2 = "";
						var qbname3 = "";var qbrelation3 = "";var qbbenifit3 = "";var qbdate3 = "";var qbvalue3 = "";var qbremarks3 = "";
						var qbname4 = "";var qbrelation4 = "";var qbbenifit4 = "";var qbdate4 = "";var qbvalue4 = "";var qbremarks4 = "";

						var qcname1 = "";var qcrelation1 = "";var qccomprelation1 = "";var qcdate1 = "";var qcclarifictaion1 = "";
						var qcname2 = "";var qcrelation2 = "";var qccomprelation2 = "";var qcdate2 = "";var qcclarifictaion2 = "";
						var qcname3 = "";var qcrelation3 = "";var qccomprelation3 = "";var qcdate3 = "";var qcclarifictaion3 = "";
						var qcname4 = "";var qcrelation4 = "";var qccomprelation4 = "";var qcdate4 = "";var qcclarifictaion4 = "";

						var qdname1 = "";var qdrelation1 = "";var qdcomprelation1 = "";var qddate1 = "";var qddetails1 = "";
						var qdname2 = "";var qdrelation2 = "";var qdcomprelation2 = "";var qddate2 = "";var qddetails2 = "";
						var qdname3 = "";var qdrelation3 = "";var qdcomprelation3 = "";var qddate3 = "";var qddetails3 = "";
						var qdname4 = "";var qdrelation4 = "";var qdcomprelation4 = "";var qddate4 = "";var qddetails4 = "";

						var qecompany1 = "";var qerelation1 = "";var qebenifit1 = "";var qedate1 = "";var qevalue1 = "";var qeremarks1 = "";
						var qecompany2 = "";var qerelation2 = "";var qebenifit2 = "";var qedate2 = "";var qevalue2 = "";var qeremarks2 = "";
						var qecompany3 = "";var qerelation3 = "";var qebenifit3 = "";var qedate3 = "";var qevalue3 = "";var qeremarks3 = "";
						var qecompany4 = "";var qerelation4 = "";var qebenifit4 = "";var qedate4 = "";var qevalue4 = "";var qeremarks4 = "";

						var qfcompany1 = "";var qfcomprelation1 = "";var qfservice1 = "";var qfdate1 = "";var qfclarification1 = "";
						var qfcompany2 = "";var qfcomprelation2 = "";var qfservice2 = "";var qfdate2 = "";var qfclarification2 = "";
						var qfcompany3 = "";var qfcomprelation3 = "";var qfservice3 = "";var qfdate3 = "";var qfclarification3 = "";
						var qfcompany4 = "";var qfcomprelation4 = "";var qfservice4 = "";var qfdate4 = "";var qfclarification4 = "";

						var qgname1 = "";var qgposition1 = "";var qgcompany1 = "";var qgrelation1 = "";var qgapproved1 = "";var qgclarification1 = "";
						var qgname2 = "";var qgposition2 = "";var qgcompany2 = "";var qgrelation2 = "";var qgapproved2 = "";var qgclarification2 = "";
						var qgname3 = "";var qgposition3 = "";var qgcompany3 = "";var qgrelation3 = "";var qgapproved3 = "";var qgclarification3 = "";
						var qgname4 = "";var qgposition4 = "";var qgcompany4 = "";var qgrelation4 = "";var qgapproved4 = "";var qgclarification4 = "";

						item.CreatedBy=item.Author.Title;
						item.ModifiedBy=item.Editor.Title;

						if(item.QuestionA=="No"){
							item.QuestionAComment="";
						}

						if(item.QuestionB=="No"){
							item.QuestionBComment="";
						}
						if(item.QuestionC=="No"){
							item.QuestionCComment="";
						}
						if(item.QuestionD=="No"){
							item.QuestionDComment="";
						}
						if(item.QuestionE=="No"){
							item.QuestionEComment="";
						}
						if(item.QuestionF=="No"){
							item.QuestionFComment="";
						}
						if(item.QuestionG=="No"){
							item.QuestionGComment="";
						}

						if(item.QuestionH=="No"){
							item.QuestionHComment="";
						}

						// if (item.QuestionA == "Yes") {
						// 	try {
						// 		var comment = item.QuestionAComment.trim();
						// 		if (comment !== "") {
						// 			var jsonData = [{ "comment": comment }];
						// 			qaJSON=jsonData;
						// 			item.QuestionAComment = comment;
						// 		} else {
						// 			item.QuestionAComment = "[]"; 
						// 		}
						// 	} catch (error) {
						// 		console.log("QA:" + item.QuestionAComment + " " + error);
						// 	}
						// }
						if (item.QuestionH == "Yes") {
							try {
								var comment = item.QuestionHComment.trim();
								if (comment !== "") {
									var jsonData = [{ "comment": comment }];
									qhJSON=jsonData;
									item.QuestionHComment = comment;
								} else {
									item.QuestionHComment = "[]"; // Store an empty array if the string is empty
								}
							} catch (error) {
								console.log("QH:" + item.QuestionHComment + " " + error);
							}
						}
						
						if(item.QuestionB=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionBComment);
								var filteredData = jsonData.filter(function(item:any) {
									// Check if any value exists in the item
									for (var key in item) {
										if (item[key] !== "") {
											return true; // Keep the item if any value exists
										}
									}
									return false; // Remove the item if all values are empty
								});
								qbJSON=filteredData;
								item.QuestionBComment=JSON.stringify(filteredData);
							} catch (error) {
								console.log("QB:"+item.QuestionBComment + " " + error);
							}
						}

						if(item.QuestionC=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionCComment);
								var filteredData = jsonData.filter(function(item:any) {
									for (var key in item) {
										if (item[key] !== "") {
											return true; 
										}
									}
									return false;
								});
								item.QuestionCComment=JSON.stringify(filteredData);
								qcJSON=filteredData;
							} catch (error) {
								console.log("QC:"+item.QuestionCComment + " " + error);
							}
							
						}
						if(item.QuestionD=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionDComment);
								var filteredData = jsonData.filter(function(item:any) {
									for (var key in item) {
										if (item[key] !== "") {
											return true; 
										}
									}
									return false;
								});
								item.QuestionDComment=JSON.stringify(filteredData);
								qdJSON=filteredData;
							} catch (error) {
								console.log("QD:"+item.QuestionDComment + " " + error);
							}
							
						}
						if(item.QuestionE=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionEComment);
								var filteredData = jsonData.filter(function(item:any) {
									for (var key in item) {
										if (item[key] !== "") {
											return true; 
										}
									}
									return false;
								});
								item.QuestionEComment=JSON.stringify(filteredData);
								qeJSON=filteredData;
							} catch (error) {
								console.log("QE:"+item.QuestionEComment + " " + error);
							}
						}
						if(item.QuestionF=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionFComment);
								var filteredData = jsonData.filter(function(item:any) {
									for (var key in item) {
										if (item[key] !== "") {
											return true; 
										}
									}
									return false;
								});
								item.QuestionFComment=JSON.stringify(filteredData);
								qfJSON=filteredData;
							} catch (error) {
								console.log("QF:"+item.QuestionFComment + " " + error);
							}
						}
						if(item.QuestionG=="Yes"){
							try {
								let jsonData = JSON.parse(item.QuestionGComment);
								var filteredData = jsonData.filter(function(item:any) {
									for (var key in item) {
										if (item[key] !== "") {
											return true; 
										}
									}
									return false;
								});
								item.QuestionGComment=JSON.stringify(filteredData);
								qgJSON=filteredData;
							} catch (error) {
								console.log("QG:"+item.QuestionGComment + " " + error);
							}
						}
						
						var maxCount=Math.max(qbJSON.length,qcJSON.length,qdJSON.length,qeJSON.length,qfJSON.length,qgJSON.length,qhJSON.length);
						
						if(maxCount>0 && ( item.QuestionB=="Yes" || item.QuestionC=="Yes" || item.QuestionD=="Yes" || item.QuestionE=="Yes" || item.QuestionF=="Yes" || item.QuestionG=="Yes" || item.QuestionH=="Yes")){
							for (let i = 0; i < maxCount; i++) {

								// if(i<qaJSON.length){
								// 	if(i==0){
								// 		item.QuestionAComment=qaJSON[i]["comment"];
								// 	}
								// }
								if(i<qhJSON.length){
									if(i==0){
										item.QuestionHComment=qhJSON[i]["comment"];
									}
								}
								
								if(i<qbJSON.length){
									if(i==0){
										qbname1 = qbJSON[i]["qbname"+(i+1)];
										qbrelation1 = qbJSON[i]["qbrelation"+(i+1)];
										qbbenifit1 = qbJSON[i]["qbbenifit"+(i+1)];
										qbdate1 = qbJSON[i]["qbdate"+(i+1)];
										qbvalue1 = qbJSON[i]["qbvalue"+(i+1)];
										qbremarks1 = qbJSON[i]["qbremarks"+(i+1)];
									}
									if(i==1){
										qbname2 = qbJSON[i]["qbname"+(i+1)];
										qbrelation2 = qbJSON[i]["qbrelation"+(i+1)];
										qbbenifit2 = qbJSON[i]["qbbenifit"+(i+1)];
										qbdate2 = qbJSON[i]["qbdate"+(i+1)];
										qbvalue2 = qbJSON[i]["qbvalue"+(i+1)];
										qbremarks2 = qbJSON[i]["qbremarks"+(i+1)];
									}
									if(i==2){
										qbname3 = qbJSON[i]["qbname"+(i+1)];
										qbrelation3 = qbJSON[i]["qbrelation"+(i+1)];
										qbbenifit3 = qbJSON[i]["qbbenifit"+(i+1)];
										qbdate3 = qbJSON[i]["qbdate"+(i+1)];
										qbvalue3 = qbJSON[i]["qbvalue"+(i+1)];
										qbremarks3 = qbJSON[i]["qbremarks"+(i+1)];
									}
									if(i==3){
										qbname4 = qbJSON[i]["qbname"+(i+1)];
										qbrelation4 = qbJSON[i]["qbrelation"+(i+1)];
										qbbenifit4 = qbJSON[i]["qbbenifit"+(i+1)];
										qbdate4 = qbJSON[i]["qbdate"+(i+1)];
										qbvalue4 = qbJSON[i]["qbvalue"+(i+1)];
										qbremarks4 = qbJSON[i]["qbremarks"+(i+1)];
									}
									
								}

								if(i<qcJSON.length){
									if(i==0){
										qcname1 = qcJSON[i]["qcname"+(i+1)];
										qcrelation1 = qcJSON[i]["qcrelation"+(i+1)];
										qccomprelation1 = qcJSON[i]["qccomprelation"+(i+1)];
										qcdate1 = qcJSON[i]["qcdate"+(i+1)];
										qcclarifictaion1 = qcJSON[i]["qcclarifictaion"+(i+1)];
									}
									if(i==1){
										qcname2 = qcJSON[i]["qcname"+(i+1)];
										qcrelation2 = qcJSON[i]["qcrelation"+(i+1)];
										qccomprelation2 = qcJSON[i]["qccomprelation"+(i+1)];
										qcdate2 = qcJSON[i]["qcdate"+(i+1)];
										qcclarifictaion2 = qcJSON[i]["qcclarifictaion"+(i+1)];
									}
									if(i==2){
										qcname3 = qcJSON[i]["qcname"+(i+1)];
										qcrelation3 = qcJSON[i]["qcrelation"+(i+1)];
										qccomprelation3 = qcJSON[i]["qccomprelation"+(i+1)];
										qcdate3 = qcJSON[i]["qcdate"+(i+1)];
										qcclarifictaion3 = qcJSON[i]["qcclarifictaion"+(i+1)];
									}
									if(i==3){
										qcname4 = qcJSON[i]["qcname"+(i+1)];
										qcrelation4 = qcJSON[i]["qcrelation"+(i+1)];
										qccomprelation4 = qcJSON[i]["qccomprelation"+(i+1)];
										qcdate4 = qcJSON[i]["qcdate"+(i+1)];
										qcclarifictaion4 = qcJSON[i]["qcclarifictaion"+(i+1)];
									}
								}

								if(i<qdJSON.length){
									if(i==0){
										qdname1 = qdJSON[i]["qdname"+(i+1)];
										qdrelation1 = qdJSON[i]["qdrelation"+(i+1)];
										qdcomprelation1 = qdJSON[i]["qdcomprelation"+(i+1)];
										qddate1 = qdJSON[i]["qddate"+(i+1)];
										qddetails1 = qdJSON[i]["qddetails"+(i+1)];
									}
									if(i==1){
										qdname2 = qdJSON[i]["qdname"+(i+1)];
										qdrelation2 = qdJSON[i]["qdrelation"+(i+1)];
										qdcomprelation2 = qdJSON[i]["qdcomprelation"+(i+1)];
										qddate2 = qdJSON[i]["qddate"+(i+1)];
										qddetails2 = qdJSON[i]["qddetails"+(i+1)];
									}
									if(i==2){
										qdname3 = qdJSON[i]["qdname"+(i+1)];
										qdrelation3 = qdJSON[i]["qdrelation"+(i+1)];
										qdcomprelation3 = qdJSON[i]["qdcomprelation"+(i+1)];
										qddate3 = qdJSON[i]["qddate"+(i+1)];
										qddetails3 = qdJSON[i]["qddetails"+(i+1)];
									}
									if(i==3){
										qdname4 = qdJSON[i]["qdname"+(i+1)];
										qdrelation4 = qdJSON[i]["qdrelation"+(i+1)];
										qdcomprelation4 = qdJSON[i]["qdcomprelation"+(i+1)];
										qddate4 = qdJSON[i]["qddate"+(i+1)];
										qddetails4 = qdJSON[i]["qddetails"+(i+1)];
									}
								}
								
								if(i<qeJSON.length){
									if(i==0){
										qecompany1 = qeJSON[i]["qecompany"+(i+1)];
										qerelation1 = qeJSON[i]["qerelation"+(i+1)];
										qebenifit1 = qeJSON[i]["qebenifit"+(i+1)];
										qedate1 = qeJSON[i]["qedate"+(i+1)];
										qevalue1 = qeJSON[i]["qevalue"+(i+1)];
										qeremarks1 = qeJSON[i]["qeremarks"+(i+1)];
									}
									if(i==1){
										qecompany2 = qeJSON[i]["qecompany"+(i+1)];
										qerelation2 = qeJSON[i]["qerelation"+(i+1)];
										qebenifit2 = qeJSON[i]["qebenifit"+(i+1)];
										qedate2 = qeJSON[i]["qedate"+(i+1)];
										qevalue2 = qeJSON[i]["qevalue"+(i+1)];
										qeremarks2 = qeJSON[i]["qeremarks"+(i+1)];
									}
									if(i==2){
										qecompany3 = qeJSON[i]["qecompany"+(i+1)];
										qerelation3 = qeJSON[i]["qerelation"+(i+1)];
										qebenifit3 = qeJSON[i]["qebenifit"+(i+1)];
										qedate3 = qeJSON[i]["qedate"+(i+1)];
										qevalue3 = qeJSON[i]["qevalue"+(i+1)];
										qeremarks3 = qeJSON[i]["qeremarks"+(i+1)];
									}
									if(i==3){
										qecompany4 = qeJSON[i]["qecompany"+(i+1)];
										qerelation4 = qeJSON[i]["qerelation"+(i+1)];
										qebenifit4 = qeJSON[i]["qebenifit"+(i+1)];
										qedate4 = qeJSON[i]["qedate"+(i+1)];
										qevalue4 = qeJSON[i]["qevalue"+(i+1)];
										qeremarks4 = qeJSON[i]["qeremarks"+(i+1)];
									}
									
								}
								
								if(i<qfJSON.length){
									if(i==0){
										qfcompany1 = qfJSON[i]["qfcompany"+(i+1)];
										qfcomprelation1 = qfJSON[i]["qfcomprelation"+(i+1)];
										qfservice1 = qfJSON[i]["qfservice"+(i+1)];
										qfdate1 = qfJSON[i]["qfdate"+(i+1)];
										qfclarification1 = qfJSON[i]["qfclarification"+(i+1)];
									}
									if(i==1){
										qfcompany2 = qfJSON[i]["qfcompany"+(i+1)];
										qfcomprelation2 = qfJSON[i]["qfcomprelation"+(i+1)];
										qfservice2 = qfJSON[i]["qfservice"+(i+1)];
										qfdate2 = qfJSON[i]["qfdate"+(i+1)];
										qfclarification2 = qfJSON[i]["qfclarification"+(i+1)];
									}
									if(i==2){
										qfcompany3 = qfJSON[i]["qfcompany"+(i+1)];
										qfcomprelation3 = qfJSON[i]["qfcomprelation"+(i+1)];
										qfservice3 = qfJSON[i]["qfservice"+(i+1)];
										qfdate3 = qfJSON[i]["qfdate"+(i+1)];
										qfclarification3 = qfJSON[i]["qfclarification"+(i+1)];
									}
									if(i==3){
										qfcompany4 = qfJSON[i]["qfcompany"+(i+1)];
										qfcomprelation4 = qfJSON[i]["qfcomprelation"+(i+1)];
										qfservice4 = qfJSON[i]["qfservice"+(i+1)];
										qfdate4 = qfJSON[i]["qfdate"+(i+1)];
										qfclarification4 = qfJSON[i]["qfclarification"+(i+1)];
									}
								}
								
								if(i<qgJSON.length){
									if(i==0){
										qgname1 = qgJSON[i]["qgname"+(i+1)];
										qgposition1 = qgJSON[i]["qgposition"+(i+1)];
										qgcompany1 = qgJSON[i]["qgcompany"+(i+1)];
										qgrelation1 = qgJSON[i]["qgrelation"+(i+1)];
										qgapproved1 = qgJSON[i]["qgapproved"+(i+1)];
										qgclarification1 = qgJSON[i]["qgclarification"+(i+1)];
									}
									if(i==1){
										qgname2 = qgJSON[i]["qgname"+(i+1)];
										qgposition2 = qgJSON[i]["qgposition"+(i+1)];
										qgcompany2 = qgJSON[i]["qgcompany"+(i+1)];
										qgrelation2 = qgJSON[i]["qgrelation"+(i+1)];
										qgapproved2 = qgJSON[i]["qgapproved"+(i+1)];
										qgclarification2 = qgJSON[i]["qgclarification"+(i+1)];
									}
									if(i==2){
										qgname3 = qgJSON[i]["qgname"+(i+1)];
										qgposition3 = qgJSON[i]["qgposition"+(i+1)];
										qgcompany3 = qgJSON[i]["qgcompany"+(i+1)];
										qgrelation3 = qgJSON[i]["qgrelation"+(i+1)];
										qgapproved3 = qgJSON[i]["qgapproved"+(i+1)];
										qgclarification3 = qgJSON[i]["qgclarification"+(i+1)];
									}
									if(i==3){
										qgname4 = qgJSON[i]["qgname"+(i+1)];
										qgposition4 = qgJSON[i]["qgposition"+(i+1)];
										qgcompany4 = qgJSON[i]["qgcompany"+(i+1)];
										qgrelation4 = qgJSON[i]["qgrelation"+(i+1)];
										qgapproved4 = qgJSON[i]["qgapproved"+(i+1)];
										qgclarification4 = qgJSON[i]["qgclarification"+(i+1)];
									}
								}
							}
							//return filteredItem;
							tempfilteredListData.push(item);

							tempfilteredListData.forEach(function(tempitem) {
								var filteredItem:any = {};
								columnsToInclude.forEach(function(column) {
									if (tempitem[column] !== undefined) {
										//else{
										filteredItem[column] = tempitem[column];
										//}
									}
									else{

										filteredItem["qbname1"]=qbname1;
										filteredItem["qbrelation1"]=qbrelation1;
										filteredItem["qbbenifit1"]=qbbenifit1;
										filteredItem["qbdate1"]=qbdate1;
										filteredItem["qbvalue1"]=qbvalue1;
										filteredItem["qbremarks1"]=qbremarks1;

										filteredItem["qbname2"]=qbname2;
										filteredItem["qbrelation2"]=qbrelation2;
										filteredItem["qbbenifit2"]=qbbenifit2;
										filteredItem["qbdate2"]=qbdate2;
										filteredItem["qbvalue2"]=qbvalue2;
										filteredItem["qbremarks2"]=qbremarks2;

										filteredItem["qbname3"]=qbname3;
										filteredItem["qbrelation3"]=qbrelation3;
										filteredItem["qbbenifit3"]=qbbenifit3;
										filteredItem["qbdate3"]=qbdate3;
										filteredItem["qbvalue3"]=qbvalue3;
										filteredItem["qbremarks3"]=qbremarks3;
										
										filteredItem["qbname4"]=qbname4;
										filteredItem["qbrelation4"]=qbrelation4;
										filteredItem["qbbenifit4"]=qbbenifit4;
										filteredItem["qbdate4"]=qbdate4;
										filteredItem["qbvalue4"]=qbvalue4;
										filteredItem["qbremarks4"]=qbremarks4;

										filteredItem["qcname1"]=qcname1;
										filteredItem["qcrelation1"]=qcrelation1;
										filteredItem["qccomprelation1"]=qccomprelation1;
										filteredItem["qcdate1"]=qcdate1;
										filteredItem["qcclarifictaion1"]=qcclarifictaion1;

										filteredItem["qcname2"]=qcname2;
										filteredItem["qcrelation2"]=qcrelation2;
										filteredItem["qccomprelation2"]=qccomprelation2;
										filteredItem["qcdate2"]=qcdate2;
										filteredItem["qcclarifictaion2"]=qcclarifictaion2;

										filteredItem["qcname3"]=qcname3;
										filteredItem["qcrelation3"]=qcrelation3;
										filteredItem["qccomprelation3"]=qccomprelation3;
										filteredItem["qcdate3"]=qcdate3;
										filteredItem["qcclarifictaion3"]=qcclarifictaion3;

										filteredItem["qcname4"]=qcname4;
										filteredItem["qcrelation4"]=qcrelation4;
										filteredItem["qccomprelation4"]=qccomprelation4;
										filteredItem["qcdate4"]=qcdate4;
										filteredItem["qcclarifictaion4"]=qcclarifictaion4;
										
										filteredItem["qdname1"]=qdname1;
										filteredItem["qdrelation1"]=qdrelation1;
										filteredItem["qdcomprelation1"]=qdcomprelation1;
										filteredItem["qddate1"]=qddate1;
										filteredItem["qddetails1"]=qddetails1;

										filteredItem["qdname2"]=qdname2;
										filteredItem["qdrelation2"]=qdrelation2;
										filteredItem["qdcomprelation2"]=qdcomprelation2;
										filteredItem["qddate2"]=qddate2;
										filteredItem["qddetails2"]=qddetails2;

										filteredItem["qdname3"]=qdname3;
										filteredItem["qdrelation3"]=qdrelation3;
										filteredItem["qdcomprelation3"]=qdcomprelation3;
										filteredItem["qddate3"]=qddate3;
										filteredItem["qddetails3"]=qddetails3;

										filteredItem["qdname4"]=qdname4;
										filteredItem["qdrelation4"]=qdrelation4;
										filteredItem["qdcomprelation4"]=qdcomprelation4;
										filteredItem["qddate4"]=qddate4;
										filteredItem["qddetails4"]=qddetails4;

										filteredItem["qecompany1"]=qecompany1;
										filteredItem["qerelation1"]=qerelation1;
										filteredItem["qebenifit1"]=qebenifit1;
										filteredItem["qedate1"]=qedate1;
										filteredItem["qevalue1"]=qevalue1;
										filteredItem["qeremarks1"]=qeremarks1;

										filteredItem["qecompany2"]=qecompany2;
										filteredItem["qerelation2"]=qerelation2;
										filteredItem["qebenifit2"]=qebenifit2;
										filteredItem["qedate2"]=qedate2;
										filteredItem["qevalue2"]=qevalue2;
										filteredItem["qeremarks2"]=qeremarks2;

										filteredItem["qecompany3"]=qecompany3;
										filteredItem["qerelation3"]=qerelation3;
										filteredItem["qebenifit3"]=qebenifit3;
										filteredItem["qedate3"]=qedate3;
										filteredItem["qevalue3"]=qevalue3;
										filteredItem["qeremarks3"]=qeremarks3;

										filteredItem["qecompany4"]=qecompany4;
										filteredItem["qerelation4"]=qerelation4;
										filteredItem["qebenifit4"]=qebenifit4;
										filteredItem["qedate4"]=qedate4;
										filteredItem["qevalue4"]=qevalue4;
										filteredItem["qeremarks4"]=qeremarks4;

										filteredItem["qfcompany1"]=qfcompany1;
										filteredItem["qfcomprelation1"]=qfcomprelation1;
										filteredItem["qfservice1"]=qfservice1;
										filteredItem["qfdate1"]=qfdate1;
										filteredItem["qfclarification1"]=qfclarification1;

										filteredItem["qfcompany2"]=qfcompany2;
										filteredItem["qfcomprelation2"]=qfcomprelation2;
										filteredItem["qfservice2"]=qfservice2;
										filteredItem["qfdate2"]=qfdate2;
										filteredItem["qfclarification2"]=qfclarification2;

										filteredItem["qfcompany3"]=qfcompany3;
										filteredItem["qfcomprelation3"]=qfcomprelation3;
										filteredItem["qfservice3"]=qfservice3;
										filteredItem["qfdate3"]=qfdate3;
										filteredItem["qfclarification3"]=qfclarification3;

										filteredItem["qfcompany4"]=qfcompany4;
										filteredItem["qfcomprelation4"]=qfcomprelation4;
										filteredItem["qfservice4"]=qfservice4;
										filteredItem["qfdate4"]=qfdate4;
										filteredItem["qfclarification4"]=qfclarification4;

										filteredItem["qgname1"]=qgname1;
										filteredItem["qgposition1"]=qgposition1;
										filteredItem["qgcompany1"]=qgcompany1;
										filteredItem["qgrelation1"]=qgrelation1;
										filteredItem["qgapproved1"]=qgapproved1;
										filteredItem["qgclarification1"]=qgclarification1;

										filteredItem["qgname2"]=qgname2;
										filteredItem["qgposition2"]=qgposition2;
										filteredItem["qgcompany2"]=qgcompany2;
										filteredItem["qgrelation2"]=qgrelation2;
										filteredItem["qgapproved2"]=qgapproved2;
										filteredItem["qgclarification2"]=qgclarification2;

										filteredItem["qgname3"]=qgname3;
										filteredItem["qgposition3"]=qgposition3;
										filteredItem["qgcompany3"]=qgcompany3;
										filteredItem["qgrelation3"]=qgrelation3;
										filteredItem["qgapproved3"]=qgapproved3;
										filteredItem["qgclarification3"]=qgclarification3;

										filteredItem["qgname4"]=qgname4;
										filteredItem["qgposition4"]=qgposition4;
										filteredItem["qgcompany4"]=qgcompany4;
										filteredItem["qgrelation4"]=qgrelation4;
										filteredItem["qgapproved4"]=qgapproved4;
										filteredItem["qgclarification4"]=qgclarification4;

									}
								});
								filteredListData.push(filteredItem);
							});

						}
						else{
							
						}
						
					});
					// Convert data to Excel workbook
					var wb = XLSX.utils.book_new();
					var ws = XLSX.utils.json_to_sheet(filteredListData);

					// Set column widths
					// ws['!cols'] = [{ width: 50 }];

					// // Set cell styles for card-like appearance
					// var range = XLSX.utils.decode_range(ws['!ref']);
					// for (var row = range.s.r + 1; row <= range.e.r; row++) {
					// 	for (var col = range.s.c; col <= range.e.c; col++) {
					// 		var cell_address = { c: col, r: row };
					// 		var cell_ref = XLSX.utils.encode_cell(cell_address);
					// 		var cell = ws[cell_ref];

					// 		// Add border and background color
					// 		cell.s = {
					// 			border: { top: { style: 'thin', color: { auto: 1 } }, right: { style: 'thin', color: { auto: 1 } }, bottom: { style: 'thin', color: { auto: 1 } }, left: { style: 'thin', color: { auto: 1 } } },
					// 			fill: { bgColor: { indexed: 9 }, fgColor: { rgb: 'FFFF00' } }
					// 		};
					// 	}
					// }

					
					
					XLSX.utils.book_append_sheet(wb, ws, "List Data");

					// Save Excel file
					XLSX.writeFile(wb, "COI_Report.xlsx");
						

            }
					//$.LoadingOverlay("hide");
					
				},
				error: function(error:any) {
					console.log("Error fetching data: " + error);
				}
			});
		}
	}

	
}
