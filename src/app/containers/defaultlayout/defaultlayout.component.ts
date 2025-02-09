import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-responsive';
//declare const $:any;  
@Component({
    selector: 'app-defaultlayout',
    standalone: true,
    imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './defaultlayout.component.html',
    styleUrl: './defaultlayout.component.scss'
})

export class DefaultlayoutComponent implements OnInit { //,AfterViewInit
    form!: FormGroup;
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
    constructor(public router: Router, public service: ApiService, private fb: FormBuilder,private cd: ChangeDetectorRef
    ) {


    }
    openModal() {
        this.myModal = true;
    }

    closeModal() {
        this.myModal = false;
        this.CreateForm();
    }
    setActiveTab(tab: string): void {
        this.activeTab = tab;
      }
      user:any;
    ngOnInit(): void {
        this.CreateForm();
        this.radioChanges();
        this.service.getUserName().subscribe(res => {
            if (res != null) {
                let user = res as any;
                this.user=user;
               this.initialiazeDatatable(user.d.Email); // render datatable based on current user, as of now retrieving all data
               this.getMytasksCOIData();
            }
        });
       
    }
//     ngAfterViewInit(): void {
       
//     const table = $('#mytasks').DataTable();
    
//     // Listen for clicks on the 'View' button
//     $('#mytasks').on('click', '.approve_task', (event: any) => {
//       const taskId = $(event.target).data('id');
//       this.router.navigate(['/task-approve', taskId]);
//     });
//   }

    initialiazeDatatable(user:any){
        this.service.getUserCOIData(user).subscribe(data => {
            var dataset1 = data as any;
            console.log(dataset1.value);
            //var currentUserId = _spPageContextInfo.userId;
            const table: any = $("#tblMyCOI");
            table.DataTable({
                "order": [[0, "desc"]],
                destroy: true,
                "aLengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
                "iDisplayLength": 10,
                rowReorder: {
                    selector: 'td:nth-child(2)'
                },
                responsive: true,
                data: dataset1.value,
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


                                status_html = '<a data-task="' + e.ID + '" data-tab="myrequest" class="anc_task">View COI </a>';
                                // "<span style='padding: 5px;background-color: #00a65a;color: #fff;font-weight: 600;border-radius: 15px;'>" + e.ID+ "<span>";

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
            $('#tblMyCOI tbody').on('click', '.anc_task', (event) => {
                const rowData = $(event.currentTarget).closest('tr').data();
                const taskId = $(event.currentTarget).data('task');
          
                // Find the row data using taskId
                const selectedRow = dataset1.find((item:any) => item.ID === taskId);
                if (selectedRow) {
                  this.viewCOI(selectedRow);
                }
            });
        });
    }
    myModalView: boolean = false;
    myModal: boolean = false;
    fn_resubmit() {
        this.myModalView = false;
        this.myModal = true;
        this.CreateForm();
        this.readOnly=false;
        this.cd.detectChanges();
    }
    viewCOI(rowData: any) {
        this.readOnly = true;
        this.populateForm(rowData); // Pass row data to the form
        this.toggleDisable(true);
        // Set form to read-only mode
        this.myModal=true;
        this.cd.detectChanges();
        // this.service.getCOI(taskid).then(res => {
        //     console.log(res);
        // });
    }
    populateForm(data: any): void {
        // Populate simple key-value pairs

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
                qgcompany: item[`qgcompany${index + 1}`] || '',
                qgapproved: item[`qgapproved${index + 1}`] || '',
                qgclarification: item[`qgclarification${index + 1}`] || ''
            })
          );
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
      
    
    CreateForm(): void {
        this.form = this.fb.group({
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
        this.form.get('question2.radio1b')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio1bDetails(value === 'Yes');
        });
        this.form.get('question3.radio1c')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio1cDetails(value === 'Yes');
        });
        this.form.get('question4.radio1d')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio1dDetails(value === 'Yes');
        });
        this.form.get('question5.radio2e')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio2eDetails(value === 'Yes');
        });
        this.form.get('question6.radio2f')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio2fDetails(value === 'Yes');
        });
        this.form.get('question7.radio2g')?.valueChanges.subscribe((value) => {
            this.updateValidatorsForRadio2gDetails(value === 'Yes');
        });
    }
    applyConditionalValidators(question: string): void {
        switch (question) {
            case "qb": {
                const isYes = this.form.get('question2.radio1b')?.value === 'Yes';
                this.updateValidatorsForRadio1bDetails(isYes);
                break;
            }
            case "qc": {
                const isYes = this.form.get('question3.radio1c')?.value === 'Yes';
                this.updateValidatorsForRadio1cDetails(isYes);
                break;

            }
            case "qd": {
                const isYes = this.form.get('question4.radio1d')?.value === 'Yes';
                this.updateValidatorsForRadio1dDetails(isYes);
                break;

            }
            case "qe": {
                const isYes = this.form.get('question5.radio2e')?.value === 'Yes';
                this.updateValidatorsForRadio2eDetails(isYes);
                break;

            }
            case "qf": {
                const isYes = this.form.get('question6.radio2f')?.value === 'Yes';
                this.updateValidatorsForRadio2fDetails(isYes);
                break;
            }
            case "qg": {
                const isYes = this.form.get('question7.radio2g')?.value === 'Yes';
                this.updateValidatorsForRadio2gDetails(isYes);
                break;

            }
            default:
                break;
        }

    }
    updateValidatorsForRadio1bDetails(isYes: boolean): void {
        this.radio1bDetails.controls.forEach((row) => {
            if (isYes) {
                row.get('qbname')?.setValidators(Validators.required);
                row.get('qbrelation')?.setValidators(Validators.required);
                row.get('qbbenifit')?.setValidators(Validators.required);
                row.get('qbdate')?.setValidators(Validators.required);
                row.get('qbvalue')?.setValidators(Validators.required);
            } else {
                row.get('qbname')?.clearValidators();
                row.get('qbrelation')?.clearValidators();
                row.get('qbbenifit')?.clearValidators();
                row.get('qbdate')?.clearValidators();
                row.get('qbvalue')?.clearValidators();
            }
            row.get('qbname')?.updateValueAndValidity();
            row.get('qbrelation')?.updateValueAndValidity();
            row.get('qbbenifit')?.updateValueAndValidity();
            row.get('qbdate')?.updateValueAndValidity();
            row.get('qbvalue')?.updateValueAndValidity();
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
            } else {
                row.get('qecompany')?.clearValidators();
                row.get('qerelation')?.clearValidators();
                row.get('qebenifit')?.clearValidators();
                row.get('qedate')?.clearValidators();
                row.get('qevalue')?.clearValidators();
            }
            row.get('qecompany')?.updateValueAndValidity();
            row.get('qerelation')?.updateValueAndValidity();
            row.get('qebenifit')?.updateValueAndValidity();
            row.get('qedate')?.updateValueAndValidity();
            row.get('qevalue')?.updateValueAndValidity();
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
            const rowJson = `{"qecompany${index + 1}":"${rowValue.qecompany}","qerelation${index + 1}":"${rowValue.qerelation}","qebenifit${index + 1}":"${rowValue.qebenifit}","qedate${index + 1}":"${rowValue.qedate}","qevalue${index + 1}":"${rowValue.qevalue}"}`;
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
            QuestionAComment:this.form.get('question1')?.get('radio1aDetails')?.value,
            QuestionBComment:QuestionBComment,
		    QuestionCComment:QuestionCComment,
		    QuestionDComment:QuestionDComment,
		    QuestionEComment:QuestionEComment,
		    QuestionFComment:QuestionFComment,
		    QuestionGComment:QuestionGComment,
            QuestionHComment:this.form.get('question8')?.get('radio2hDetails')?.value,
            Status: "Submitted",
            Stage:"New",
            Level:"LM",
        }
        this.service.AddCOI(finalData).then((res) =>{
             alert("Thank you for submiting Conflict of Interest");
             window.location.reload();
            //  swal(
            //     '',
            //     'Thank you for submiting Conflict of Interest',
            //     'success'
            //     ).then(function () {
            //         window.location.href = "https://mafportal.maf.ae/CompliancePreProd/SitePages/COIHolding.aspx";
            // })
             this.myModal=false;
             this.CreateForm();
        });

        
       

    }
    getMytasksCOIData(){
        this.service.getUserName().subscribe(res => {
            if (res != null) {
                let user = res as any;
                this.service.getMytasksCOIData(user.d.Email).subscribe(data => {
                    var dataset1 = data as any;
                    console.log(dataset1.value);
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
                                "render":  function (e: any) {
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
                                "render": function (e:any) { return `<a href="javascript:void(0);" class="approve_task" data-id="${e.ID}">View</a>`; }
                            },
        
                        ]
                    });
                
                // Listen for clicks on the 'View' button
                $('#mytasks tbody').on('click', '.approve_task', (event: any) => {
                    //const taskId = $(event.currentTarget).data('Id');
                  const taskId = $(event.target).data('id');
                  if (taskId) {
                    this.router.navigate(['/COI/task-approve', taskId]); // Navigate only if TaskID exists
                  } else {
                    console.error('TaskID is undefined or invalid!');
                  }
                 // this.router.navigate(['/task-approve', taskId]);
                });
                });
            }
        });
    }
    onMyTasksClick(event: Event): void {
        this.setActiveTab('profile');
        event.preventDefault();
        this.getMytasksCOIData();
        this.cd.detectChanges();
      }
      onSubmitCOIClick(event: Event): void {
        this.setActiveTab('home');
        event.preventDefault();
        this.initialiazeDatatable(this.user.Email);
        this.cd.detectChanges();
      }
    

}
