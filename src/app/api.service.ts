import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { from, of } from "rxjs";
import { sp ,spPost,SharePointQueryable} from '@pnp/sp';
import "@pnp/sp/webs"; 
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users";
import { IItemAddResult } from "@pnp/sp/items";


sp.setup({
  sp: {
    headers: {
      Accept: "application/json;odata=verbose",
    },
    baseUrl:environment.sp_URL 
  },
});


@Injectable({
  providedIn: "root"
})

export class ApiService {
  
  sp_URL = environment.sp_URL;
  constructor(
    private http: HttpClient
  ) { }

  getUserName() {
    return this.http.get(this.sp_URL + "/_api/Web/CurrentUser", { headers: { Accept: "application/json;odata=verbose" } });
  }
  getRecordCount() {
    const url = `${this.sp_URL}/_api/web/lists/getbytitle('COIHolding2025')/items?$top=0&$count=true`;
    const headers = new HttpHeaders({ 'Accept': 'application/json;odata=verbose' });
    return this.http.get<any>(url, { headers });
  }
  getUserCOIData(userid:any){
    var Url = this.sp_URL + "/_api/web/lists/getByTitle('COIHolding2025')/items?$select=ID,Title,Status,Created,WorkflowStatus,Author/Name,Created,Author/Id,*&$expand=Author&$orderby=ID desc&$top=5000&$filter=Author/Id eq " + userid + "";
    return this.http.get(Url);
  }
  async getAllCOIData(){
    var Url = this.sp_URL + + "/_api/web/lists/getbytitle('COIHolding2025')/items?$top=0&$count=true";
    return this.http.get(Url);
  }
  getMytasksCOIData(userId:any){
    var request_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?select=AssignedTo,PendingWith,Status,*&$filter=(AssignedTo eq '" + userId + "')"; //***replace title with email 
    return this.http.get(request_url);
  }
  getMytasksCEOData(userEmail:any){
    var request_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?select=PendingWith,Status,*&$filter=((PendingWith eq '" + userEmail + "') and (Status eq 'Pending With CEO'))";
    return this.http.get(request_url);
  }
  getMytasksCEOCompletedData(){
    var request_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?select=ApproverLevel,Level,PendingWith,Status,*&$filter=((ApproverLevel eq 'CEO') and (Status eq 'Approved'))";
    return this.http.get(request_url);
  }
  getAllCOICompletedData(opco:string){
    var request_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?$select=ID,Title,Created,WorkflowStatus,Status,Author/Name,Created,Author/Id,EmployeeEmail,EmployeeName,ManagerEmail,OPCO&$expand=Author&$filter=(OPCO eq '" + opco + "')&$top=50000";
    return this.http.get(request_url);
  }
  getDeclaredCOI(){
    var r_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?$select=ID,Title,Created,WorkflowStatus,Status,Author/Name,Created,Author/Id,"
    +"QuestionA,QuestionB,QuestionC,QuestionD,QuestionE,QuestionF,QuestionG,QuestionH,QuestionAComment,QuestionBComment,QuestionCComment,QuestionDComment,QuestionEComment,QuestionFComment,QuestionGComment,QuestionHComment,"
    +"EmployeeEmail,EmployeeName,ManagerEmail&$expand=Author"
    +"&$filter=(((QuestionB eq 'Yes') or (QuestionC eq 'Yes') or "
    +"(QuestionD eq 'Yes') or (QuestionE eq 'Yes') or (QuestionF eq 'Yes') or "
    +"(QuestionG eq 'Yes') or (QuestionH eq 'Yes')) and (Status ne 'Cancelled'))&$top=50000";
    return this.http.get(r_url);
  }
getDeclaredCOIRetail(){
  var r_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?$select=ID,Title,Created,WorkflowStatus,Status,Author/Name,Created,Author/Id,"
			+"QuestionA,QuestionB,QuestionC,QuestionD,QuestionE,QuestionF,QuestionG,QuestionH,QuestionAComment,QuestionBComment,QuestionCComment,QuestionDComment,QuestionEComment,QuestionFComment,QuestionGComment,QuestionHComment,"
			+"EmployeeEmail,EmployeeName,ManagerEmail&$expand=Author"
			+"&$filter=(OPCO eq 'Retail') and ((QuestionB eq 'Yes') or (QuestionC eq 'Yes') or "
			+"(QuestionD eq 'Yes') or (QuestionE eq 'Yes') or (QuestionF eq 'Yes') or "
			+"(QuestionG eq 'Yes') or (QuestionH eq 'Yes')) and (Status ne 'Cancelled')&$top=50000";
      return this.http.get(r_url);
}
getDeclaredCOIGS(){
  var r_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?$select=ID,Title,Created,WorkflowStatus,Status,Author/Name,Created,Author/Id,"
			+"QuestionA,QuestionB,QuestionC,QuestionD,QuestionE,QuestionF,QuestionG,QuestionH,QuestionAComment,QuestionBComment,QuestionCComment,QuestionDComment,QuestionEComment,QuestionFComment,QuestionGComment,QuestionHComment,"
			+"EmployeeEmail,EmployeeName,ManagerEmail&$expand=Author"
			+"&$filter=(OPCO eq 'Global Solutions') and ((QuestionB eq 'Yes') or (QuestionC eq 'Yes') or "
			+"(QuestionD eq 'Yes') or (QuestionE eq 'Yes') or (QuestionF eq 'Yes') or "
			+"(QuestionG eq 'Yes') or (QuestionH eq 'Yes')) and (Status ne 'Cancelled')&$top=50000";
      return this.http.get(r_url);
}

getDeclaredCOILS(){
  var r_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?$select=ID,Title,Created,WorkflowStatus,Status,Author/Name,Created,Author/Id,"
			+"QuestionA,QuestionB,QuestionC,QuestionD,QuestionE,QuestionF,QuestionG,QuestionH,QuestionAComment,QuestionBComment,QuestionCComment,QuestionDComment,QuestionEComment,QuestionFComment,QuestionGComment,QuestionHComment,"
			+"EmployeeEmail,EmployeeName,ManagerEmail&$expand=Author"
			+"&$filter=(OPCO eq 'Lifestyle') and ((QuestionB eq 'Yes') or (QuestionC eq 'Yes') or "
			+"(QuestionD eq 'Yes') or (QuestionE eq 'Yes') or (QuestionF eq 'Yes') or "
			+"(QuestionG eq 'Yes') or (QuestionH eq 'Yes')) and (Status ne 'Cancelled')&$top=50000";
      return this.http.get(r_url);
}

  getCOI(taskid:any){
    var request_url = this.sp_URL  + "/_api/web/lists/getByTitle('COIHolding2025')/items(" + taskid + ")?$select=*,Attachments,AttachmentFiles&$expand=AttachmentFiles";
    return this.http.get(request_url);

  }
  getApprovers(opco:any,aprLevel:any){
    var Url = this.sp_URL  + "/_api/web/lists/getByTitle('Approver')/items?$select=ID,Title,OPCO,ApproverEmail,ApproverName,Level&$orderby=ID desc&$top=100&$filter=((OPCO eq '" + opco + "') and (Level eq '" + aprLevel + "'))";
    return this.http.get(Url);
  }
   getRequestDigest() {
    return this.http.post(this.sp_URL +'/_api/contextinfo', {}).toPromise()
      .then((response: any) => response.FormDigestValue);
  }
   async AddCOI(COIData:any){
    const requestDigest = await this.getRequestDigest();
    //const processCOI = async () => {
    const item: IItemAddResult =
     await sp.web.lists.getByTitle("COIHolding2025").items.add({
      Agree: COIData.Agree,
      QuestionA: COIData.QuestionA,
      QuestionB: COIData.QuestionB,
      QuestionC: COIData.QuestionC,
      QuestionD: COIData.QuestionD,
      QuestionE: COIData.QuestionE,
      QuestionF: COIData.QuestionF,
      QuestionG: COIData.QuestionG,
      QuestionH: COIData.QuestionH,
      QuestionAComment:COIData.QuestionAComment,
      QuestionBComment:COIData.QuestionBComment,
      QuestionCComment:COIData.QuestionCComment,
      QuestionDComment:COIData.QuestionDComment,
      QuestionEComment:COIData.QuestionEComment,
      QuestionFComment:COIData.QuestionFComment,
      QuestionGComment:COIData.QuestionGComment,
      QuestionHComment:COIData.QuestionHComment,
      Status:COIData.Status,
      Stage:COIData.Stage,
      Level:COIData.Level

    });
    const itemId = item.data.Id;
    //for (let file of COIData.attachments) {
    if(COIData.Attachments)
      this.addAttachment(itemId, COIData.Attachments, requestDigest);
    //}
  //}
  //return from(processCOI());
  return item;
}
async addAttachment(itemId: number, file: File, requestDigest: string) {
  const url = `${this.sp_URL}/_api/web/lists/getbytitle('COIHolding2025')/items(${itemId})/AttachmentFiles/add(FileName='${file.name}')`;
  const headers = new HttpHeaders({
    'X-RequestDigest': requestDigest,
    'accept': 'application/json;odata=verbose',
    'content-type': 'application/json;odata=verbose'
  });

  return this.http.post(url, file, { headers }).toPromise();
}


async UpdateCOI(Id:any,COIData:any,Attachments:any){
  const requestDigest = await this.getRequestDigest();
  const processCOI = async () => {
     sp.web.lists.getByTitle("COIHolding2025").items.getById(Id).update(COIData);
     if(Attachments !== null)
      this.addAttachment(Id, Attachments, requestDigest);
}
return from(processCOI());
}
isUserMember(groupName:any,userId:any){
  var url= this.sp_URL + "/_api/web/sitegroups/getByName('"+ groupName +"')/Users?$filter=Id eq " + userId;
  return this.http.get(url);

}

  
}