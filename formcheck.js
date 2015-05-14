// JavaScript Document
//This is a js for front-end index.html,where there is a form to post a topic.
function formcheck(obj)
{
	//empty check
	if(obj.topic.value == "")
	{
		alert("The topic can not be empty!");
		obj.topic.focus();
		return false;
	}
	
	//maxmum characters check
	if(obj.topic.value.length>= 140)
	{
		alert("140 characters at most!");
		obj.topic.focus();
		return false;
	}
	//empty check
	if(obj.link.value == "")
	{
		alert("The link can not be empty!");
		obj.link.focus();
		return false;
	}
	
	//link check
	return true;
}