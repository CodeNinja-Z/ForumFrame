// JavaScript Document
function assNode( id,upid, topic, lnk, votes )   {
		  this.id = id;//indentifier
          this.upid = upid;//upid=0 if a new topic otherwise not(this field is not zero for replies)
          this.topic = topic;//topics or replies
          this.lnk = lnk;//null for replies
          this.votes = votes;//votes for replies or topics
		  this.time = new Date();
		  this.replies = 0;
}
var assTopicArr = new Array();
var assReplyArr = new Array();
var topicsNum;//the number of topics, not considering concurrent situations
var repliesNum;//the number of replies, not considering concurrent situations
var id;//the total number of topics and replies, not considering concurrent situations
var recursion;//recursion number for calculating the indentation
topicsNum=0;
repliesNum = 0;
id =0;
recursion = 0;
function addTopic(obj,response)
{
	obj.id = ++id;
	assTopicArr[topicsNum++] = obj;
	//response.write(topicsNum.toString());
}

function addReply(obj,response)
{
	obj.id = ++id;
	assReplyArr[repliesNum++] = obj;
	//response.write(repliesNum.toString());
	//update the reply number
	var TopicNo;
	TopicNo = -1;
	var i;
	i=0;
	for(;i<topicsNum;i++)
	{
		if(assTopicArr[i].id == obj.upid)
		{
			TopicNo = i;
			i = topicsNum+1;
		}
	}
	if(TopicNo != -1){
	assTopicArr[TopicNo].replies =  assTopicArr[TopicNo].replies + 1;
	}
	
}

//vote up for specified rid(reply id)
function addVote(rid,response)
{
	//find the top root for this reply
	var findFlg;
	findFlg = true;
	var topicID;//the root for rid
	var i;
	i=0;
	var ridTmp;
	ridTmp = rid;
	while(findFlg)
	{
		for(i=0;i<repliesNum;i++)
		{
			if(assReplyArr[i].id == ridTmp){
				//console.log(ridTmp);
				ridTmp = assReplyArr[i].upid;//upper level
				break;
			}
		}
		if(i == repliesNum)
		{
			findFlg = false;
		}
	}
	
	//now ridTmp is the id of topic
	for(i=0;i<topicsNum;i++)
	{
		if(assTopicArr[i].id == ridTmp){
			assTopicArr[i].votes = assTopicArr[i].votes +1 ;//upper level
			break;
		}
	}
}
function traverseTopic(response)
{
	var i;
	i = 0;
	//response.write(topicsNum.toString());
	response.write("<a href='/' target = 'self'>Add a new Topic</a><br/>");
	response.write("<script>");
	response.write("function show(no){if(document.getElementById(\"reply\"+no).style.display == \"none\"){document.getElementById(\"reply\"+no).style.display =\"block\";}else{document.getElementById(\"reply\"+no).style.display =\"none\";} }");
	response.write("function showReply(no){if(document.getElementById(\"topic\"+no).style.display == \"none\"){document.getElementById(\"topic\"+no).style.display =\"block\";}else{document.getElementById(\"topic\"+no).style.display =\"none\";} }");
	response.write("function formcheck(obj){if(obj.reply.value == \"\"){alert(\"The reply can not be empty!\");obj.reply.focus();return false;}}");
	response.write("</script>");
	for(;i<topicsNum;i++)
	{
		response.write("<span style='font-size:18px ;color:#666666;font-family:Verdana, Arial, Helvetica, sans-serif;'>" +(i+1).toString() + " . + </span>");
		response.write("<span style='font-size:24px ;color:#000000;font-family:Verdana, Arial, Helvetica, sans-serif;' onmouseover=this.style.cursor='hand' onmouseout=this.style.cursor='normal' onclick=\"showReply("+assTopicArr[i].id+")\">" + assTopicArr[i].topic + "</span>")
		response.write("<span style='font-size:18px ;color:#666666;font-family:Verdana, Arial, Helvetica, sans-serif;'>(<a href=" + assTopicArr[i].lnk + ">" + assTopicArr[i].lnk + "</a>)</span>")
		
		
		response.write("<span style=\"font-size:18px ;color:#00FF00;font-family:Verdana, Arial, Helvetica, sans-serif;\" onmouseover=\"this.style.cursor='hand'\" onmouseout=\"this.style.cursor='normal'\" onclick=\"show("+assTopicArr[i].id+")\"> Reply</span>")
		
		response.write("<br/>");
		response.write("<span style='font-size:16px ;color:#666666;font-family:Verdana, Arial, Helvetica, sans-serif;'>&nbsp;&nbsp;&nbsp;&nbsp;" + assTopicArr[i].votes + "points  " + assTopicArr[i].time  + "|" +assTopicArr[i].replies+ "comments</span>")
		response.write("<br/>");
		response.write("<span id='reply"+  assTopicArr[i].id +"' style='Display:none;'><form action=\"/upload\" method=\"post\" onSubmit=\"javascript:return formcheck(this);\"><textarea name=\"reply\" cols=\"40\" rows=\"4\"></textarea><br/><input type=\"hidden\" name=\"type\" value=\"reply\"/><input type=\"hidden\" name=\"id\" value=\""+assTopicArr[i].id+ "\"/><input type='submit' value='Add Comment'/></form></span>");
		
		
		//Display the replies for this topic
		//response.write("assTopicArr[i].id = " + assTopicArr[i].id + "<br/>");
		recursion = 1;
		response.write("<div id='topic" + assTopicArr[i].id +"' style='Display:block; border:#999999 1px solid; background-color:#CCCCCC'>");
		DisplayReplies(response,assTopicArr[i].id,recursion);
		response.write("</div>");
	}
}


function DisplayReplies(response,tid,recNum)//tid = topic id
{
	response.write("<script>");
	response.write("function show(no){if(document.getElementById(\"reply\"+no).style.display == \"none\"){document.getElementById(\"reply\"+no).style.display =\"block\";}else{document.getElementById(\"reply\"+no).style.display =\"none\";} }");
	response.write("function formcheck(obj){if(obj.reply.value == \"\"){alert(\"The reply can not be empty!\");obj.reply.focus();return false;}}");
	response.write("</script>");
	
	var i;
	i = 0;
	var recNumTmp;
	recNumTmp = recNum;
	for(;i<repliesNum;i++)
	{
		if(assReplyArr[i].upid == tid){
			//response.write(tid.toString());
			//response.write("tid=" + tid + "assReplyArr[i].id = " + assReplyArr[i].upid + "repliesNum=" + repliesNum + "topicsNum=" + topicsNum);
			//response.write("recNum=" + recNum);
			response.write("<table border='1'><tr><td>");
			WriteSpace(recNum,response);
			response.write("</td>");
			response.write("<td><table border='1'><tr><td><span style='font-size:16px ;color:#000000;font-family:Verdana, Arial, Helvetica, sans-serif;' onmouseover=this.style.cursor='hand' onmouseout=this.style.cursor='normal'>" + assReplyArr[i].topic + "</span></td>")
			
			//reply start
			response.write("<td><div style=\"font-size:16px ;color:#00FF00;font-family:Verdana, Arial, Helvetica, sans-serif;\" onmouseover=\"this.style.cursor='hand'\" onmouseout=\"this.style.cursor='normal'\" onclick=\"show("+assReplyArr[i].id+")\"> Reply</div></td>")
			//reply end
			//vote start
			response.write("<td><div><form action=\"/upload\" method=\"post\"><input type=\"hidden\" name=\"type\" value=\"vote\"/><input type=\"hidden\" name=\"id\" value=\""+assReplyArr[i].id+ "\"/><input type='submit' value='Vote'/></form></div></td></tr>");
			//vote end
			//WriteSpace(recNum,response);
			response.write("<tr><td colspan='3'><span id='reply"+  assReplyArr[i].id +"' style='Display:none;'><form action=\"/upload\" method=\"post\" onSubmit=\"javascript:return formcheck(this);\"><textarea name=\"reply\" cols=\"40\" rows=\"4\"></textarea><br/><input type=\"hidden\" name=\"type\" value=\"reply\"/><input type=\"hidden\" name=\"id\" value=\""+assReplyArr[i].id+ "\"/><input type='submit' value='Add Comment'/></form></span></td></tr></table>");
			
			response.write("</td></tr></table>");
			
			
			if (HasChildren(assReplyArr[i].id) == true){
				recNumTmp = recNum;
				DisplayReplies(response,assReplyArr[i].id,++recNumTmp);//recursion
			}
		}
	}
}
function WriteSpace(numOfSpace,response)
{
	var i;
	i=0;
	for(;i<numOfSpace;i++)
	{
		response.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp");
	}
}

//rid: the id of reply
//return true if the specified reply has children, otherwise return false
function HasChildren(rid)
{
	var i;
	i = 0;
	for(;i<repliesNum;i++)
	{
		if(assReplyArr[i].upid == rid){
			return true;
		}
	}
	return false;
}
//export
exports.assNode = assNode;
exports.addTopic = addTopic;
exports.addReply = addReply;
exports.addVote = addVote;
exports.traverseTopic = traverseTopic;