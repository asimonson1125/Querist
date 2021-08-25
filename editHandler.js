exports.delCommand = function (msg){
    /*
    This function is designed to take a message with a command and
    remove the command, leaving just the message after the command.
    This function should be run only after applying the changes to
    the message that the command applies.
    */
    let beginMessage = false;
    try{
      for(let i = 0; !beginMessage; i++){
        //traverse message until message start input is identified (in this case, --msg)
        if(msg.content.substring(i,i+6) == "--msg "){
          beginMessage = true;
          msg.edit(msg.content.substring(i+6));
        }
      }
    } catch (e){
      return ("--msg not found");
    }
    return("Success!");
  }