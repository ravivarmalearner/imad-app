
                var button=document.getElementById('counter');
                var counter=0;
                button.onclick = function(){
                    
                    var request= new XMLHttpRequest();
                    var nameInput=document.getElementById('name');
                    var name=nameInput.value;
                    request.onreadystatechange= function(){
                        if(request.readystate===XMLHttpRequest.DONE){
                            if(request.status===200){
                            var counter=request.responseText;
                            var span=document.getElementById('count');
                            span.innerHTML=counter.toString();
                            }
                        }
                        
                    };
                    request.open('GET','http://bmravivarmapatchamatla.imad.hasura-app.io/counter',true);
                    request.send(null);
                };
                var nameInput=document.getElementById('name');
                var name=nameInput.value;
                var submit=document.getElementById('submit-btn');
               
                submit.onclick= function(){
                     var nameInput=document.getElementById('name');
                     var name=nameInput.value;
               
                     var request= new XMLHttpRequest();
                     
                     request.onreadystatechange= function(){
                        if(request.readystate===XMLHttpRequest.DONE){
                            if(request.status===200){
                            var names=request.responseText;
                            names=JSON.parse(names);
                            var list='';
                        for(var i=0;i<names.length;i++){
                        list+='<li>'+ names[i]+ '</li>'
                        }
                    var ul=document.getElementById('namelist');
                    ul.innerHTML=list;
                     }
                        }
              };
                    
                    request.open('GET','http://bmravivarmapatchamatla.imad.hasura-app.io/name-req?name='+name,true);
                    request.send(null);  
                };
    

