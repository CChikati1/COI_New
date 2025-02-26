import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-responsive';
import { MatDialogModule } from '@angular/material/dialog'; //MAT_DIALOG_DATA, MatDialog, 
import { provideAnimations } from '@angular/platform-browser/animations';
import swal from 'sweetalert';
import { environment } from '../../environments/environment';
import html2pdf from 'html2pdf.js';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-task-print',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, FormsModule],
  providers: [
    provideAnimations(), MatDialogModule
  ],
  templateUrl: './task-print.component.html',
  styleUrl: './task-print.component.scss'
})
export class TaskPrintComponent
  implements OnInit {
  @Input() id!: string;
  taskId: string | null = null;
  form!: FormGroup;
  empForm!: FormGroup;
  readOnly = false;
  L3ButtonControls: boolean = true;
  L3FurtherAction: boolean = false;
  isOPCOHrequired: boolean = false;
  txtComments: string = '';
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
  fileNamePrint: string = '';

  isSubmitted: boolean = false;
  status: string = '';
  level: string = '';
  opco: string = '';
  aprLevel: string = '';
  depthead: string = '';
  furtherclarification: string = '';
  attachments: any[] = [];
  lblLevel2Text = '';
  lblLevel3Text = '';
  lblLevel4Text = '';
  levelOptions: any;
  levelApprovers: any;
  selectedLevel = '';
  selectedApprover = '';
  approvers: any;
  // constructor(private route: ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,public service: ApiService,
  // private dialogRef: MatDialog,private fb: FormBuilder,private cd: ChangeDetectorRef) {}
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef,
    public service: ApiService,

  ) { }


  ngOnInit(): void {
    this.readOnly = true;
    //this.CreateEmpForm();
    this.CreateForm();
    this.service.getUserName().subscribe(res => {
      if (res != null) {
        let user = res as any;
        this.viewCOI(this.id);
        this.cd.detectChanges();
        //this.getMytasksCOIData();
      }
    });

  }
  CreateEmpForm(): void {
    this.empForm = this.fb.group({
      EmpName: [''],
      EmpNumber: [''],
      Designation: [''],
      Department: [''],
      MgrName: [''],
      MgrEmail: [''],
      Division: [''],
      Company: [''],
      OPCO: ['']
    })
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
      var rowData = data;
      this.readOnly = true;
      this.populateForm(rowData); // Pass row data to the form
      //this.populateEmpForm(rowData);
      this.toggleDisable(true);
      this.cd.detectChanges();
    });

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
  
  
populateForm(data: any): void {
  // Populate simple key-value pairs
  this.fileNamePrint = data.EmployeeName + '_' + data.EmployeeNumber + '_'
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
  this.txtLMCommentsyes = !!data.ManagerComments && data.ManagerComments.trim() !== "";
  this.txtDHCommentsyes = !!data.DHComments && data.DHComments.trim() !== "";
  this.txtRACCommentsyes = !!data.RACComments && data.RACComments.trim() !== "";
  this.txtOPCOHCommentsyes = !!data.OPCOHComments && data.OPCOHComments.trim() !== "";
  this.txtOPCOCHCommentsyes = !!data.OPCOCHComments && data.OPCOCHComments.trim() !== "";

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
this.attachments = data.AttachmentFiles;
}
this.bindHistory(this.id);
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
    // this.dialogRef.closeAll();
  }
  

  async generatePDF() {
    const element = document.getElementById('container');
    const opt = {
      margin: 0,
      filename: this.fileNamePrint + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] } 

    };
    html2pdf().from(element).set(opt).save();
  }
  getFullUrl(serverRelativeUrl: string): string {
    const baseUrl = environment.sp;
    return `${baseUrl}${serverRelativeUrl}`;
  }
  bindHistory(listItemId: any) {
    //Usage
    var webUrl = environment.sp_URL;
    var listId = this.GetListGuid('COIHolding2025');//_spPageContextInfo.pageListId;

    this.getItemVersions(webUrl, listId, listItemId, function (versionEntries: any) {
      console.log(versionEntries);
    });

  }

  getItemVersions(url: any, listId: any, itemId: any, success: any) {

    this.getListItemByVersionPage(url, listId, itemId, 'Status')

  }
  async getListItemByVersionPage(listWebUrl: string, listId: string, listItemId: string, fieldName: string): Promise<any[]> {
    const versionsUrl = `${listWebUrl}/_layouts/versions.aspx?list=${listId}&ID=${listItemId}`;
    const entries: any[] = [];
    let versionCounter = 1; // Initialize version counter

    try {
      // Fetch version history page as text
      const data = await this.http.get(versionsUrl, { responseType: 'text' }).toPromise();
      if (!data) return [];

      // Parse HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');

      // Find the version list table
      const versionList = doc.querySelector('table.ms-settingsframe');
      //console.log(versionList);
      if (!versionList) return [];

      // Get all table rows
      const rows = Array.from(versionList.querySelectorAll('tbody > tr'));

      for (let i = 0; i < rows.length; i++) {
        try {
          const verRow = rows[i]; // Get version row
          const versionLabel = verRow.querySelector('td:first-child')?.textContent?.trim() || '';
          const versionDateElement = verRow.querySelector('table[ctxname="ctxVer"] a');
          const versionUserElement = verRow.querySelector('.ms-imnSpan a:nth-child(2)');

          if (
            versionLabel &&
            versionLabel !== '1.0' && versionLabel !== '2.0' && // Ignore 1.0 and 2.0
            versionDateElement && versionUserElement
          ) {
            const versionDate = versionDateElement.textContent?.trim() || '';
            const versionUser = versionUserElement.textContent?.trim() || '';

            // Adjust versionLabel
            const adjustedVersionLabel = (versionCounter++).toString();
            //const propsRow = rows[i + 1]; // Get properties row (next row)
            let propsRow = verRow.nextElementSibling; // Start with next sibling

            // Ensure we select the correct properties row
            while (propsRow && !propsRow.querySelector('table')) {
              propsRow = propsRow.nextElementSibling;
            }


            console.log(propsRow);
            const propsTable = propsRow?.querySelector('table');
            // Extract properties
            //const propsTable = propsRow.querySelector('td:nth-child(3) table'); // Get the correct table inside propsRow

            const properties = Array.from(propsTable?.querySelectorAll('tr') || []).map((tr) => {
              console.log('Processing TR:', tr.innerHTML); // Debugging

              const title = tr.querySelector('td.ms-propertysheet')?.textContent?.trim() || ''; // Get field name
              const fieldValue = tr.querySelector('td.ms-vb')?.textContent?.trim() || ''; // Get field value

              console.log('Title:', title, 'FieldValue:', fieldValue); // Debug values

              return title && fieldValue ? { title, fieldValue } : null;
            }).filter(prop => prop !== null);


            entries.push({
              Label: adjustedVersionLabel,
              Modified: versionDate,
              Editor: versionUser,
              vprops: properties
            });
          }
        } catch (error: any) {
          console.error('Parse error:', error.message);
        }
      }

      // Sort by Label in ascending order
      entries.sort((a, b) => Number(a.Label) - Number(b.Label));

      // Call PDF generation method after processing
      this.showHistory(entries);
      setTimeout(() => this.generatePDF(), 1000);
      setTimeout(() => this.goBack(), 2000);

      return entries;
    } catch (error) {
      console.error('Error fetching version page:', error);
      return [];
    }
  }


  goBack() {
    this.router.navigate(['/']); // Navigate back to the task list
  }
  GetListGuid(listTitle: any) {
    var guid = "";
    try {
      //REST Query to get the List Title 
      $.ajax(
        {
          url: environment.sp_URL + "/_api/web/lists/getbytitle('" + listTitle + "')?$select=Id",
          type: "GET",
          async: false,
          headers: { "Accept": "application/json;odata=verbose" },
          success: function (data, textStatus, xhr) {
            guid = data.d.Id;
          },
          error: function (data, textStatus, xhr) {
            console.error("Error.");
            guid = "";
          }
        });
    }
    catch (ex) {

    }

    return guid;

  }

  showHistory(entries: any) {
    $('#tblHistory').find('tbody').empty();

    if (entries != null && entries.length > 0) {
      var $TABLE = $('#tblHistory');
      var trRow = "";
      $(entries).each(function () {
        if (this.Label != '1.0' && this.Label != '2.0') {
          trRow += '<tr class="taskhistory-row">'
          trRow += '<td class="">' + this.Label + '</td>'
          trRow += '<td class="">' + (this.Modified != null ? this.Modified : "") + '</td>'
          trRow += '<td class="">' + (this.Editor != null ? this.Editor : "") + '</td>'
          trRow += '</tr>'
          console.log(this.vprops);
          if (this.vprops != null && this.vprops.length > 0) {
            trRow += '<tr class="taskhistorychild-row">'
            trRow += '<td colspan="3"><table>'
            trRow += '<thead><tr>'
            trRow += '<th class="no-sort sorting">Field Name</th>'
            trRow += '<th class="no-sort sorting">Field Value</th>'
            trRow += '</tr></thead><tbody>'

            $(this.vprops).each(function (i, val) {
              trRow += '<tr class="taskhistorydetail-row">'
              trRow += '<td class="">' + val.title + '</td>'
              trRow += '<td class="">' + (val.fieldValue != null ? val.fieldValue.replace("/dept/legal/CM_Preprod/CaseAttachments/", "Attachment : ") : "") + '</td>'
              trRow += '</tr>'
            });
            trRow += '</tbody></table></td>'
            trRow += '</tr>'
          }
        }
      });
      $TABLE.find('tbody').append(trRow);
    }
    else {
      var $TABLE = $('#tblHistory');
      var trRow = "";
      trRow += '<tr class="project-row"><td colspan=3>No history</td></tr>'
      $TABLE.find('tbody').append(trRow);
    }
  }


  getDistResults<T>(items: T[], propertyName: keyof T): T[] {
    const uniqueValues = new Set();
    return items.filter(item => {
      const value = item[propertyName];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        return true;
      }
      return false;
    });
  }


  CheckData(Url: any) {
    var obj = null;
    $.ajax({
      url: Url,
      method: "GET",
      async: false,
      dataType: "json",
      headers: { "Accept": "application/json; odata=verbose" },
      success: function (data) {

        if (data != null) {
          obj = data;
        }
      },
      error: function (data) {
        obj = null;
      }
    });
    return obj;
  }
}

