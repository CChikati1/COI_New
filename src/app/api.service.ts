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
  getUserCOIData(userid:any){
    var Url = this.sp_URL + "/_api/web/lists/getByTitle('COIHolding2025')/items?$select=ID,Title,Status,Created,WorkflowStatus,Author/Name,Created,Author/Id,*&$expand=Author&$orderby=ID desc&$top=5000&$filter=Author/Id eq " + userid + "";
    return this.http.get(Url);
  }
  getCOIData(){
    
    return sp.web.lists.getByTitle('COIHolding2025').items.getAll();
    
   // return this.http.get(this.sp_URL+ "/_api/web/lists/getByTitle('COIHolding2022')/items?$select=ID,Title,Status,Created,WorkflowStatus,Author/Name,Created,Author/Id,COIappro&$expand=Author&$orderby=ID desc&$top=5000");
  }
  getMytasksCOIData(userId:any){
    var request_url = this.sp_URL + "/_api/web/lists/getbytitle('COIHolding2025')/items?select=AssignedTo,PendingWith,Status,*&$filter=(AssignedTo eq '" + userId + "')"; //***replace title with email 
    return this.http.get(request_url);
   // return this.http.get(this.sp_URL+ "/_api/web/lists/getByTitle('COIHolding2022')/items?$select=ID,Title,Status,Created,WorkflowStatus,Author/Name,Created,Author/Id,COIappro&$expand=Author&$orderby=ID desc&$top=5000");
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
    alert("COI");
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
  console.log(requestDigest);
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
uploadFile(file:any,item:any){

}
}