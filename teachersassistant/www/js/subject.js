


function getSubjectData(key)
{
    $$('.subject-data').val(key);
     var user_id = $$('.statusbar-overlay').data('userid');
     var query = firebase.database().ref("subjects").orderByKey();
       query.once("value")
         .then(function(snapshot) {
             snapshot.forEach(function(childSnapshot) {
               var key2 = childSnapshot.key;
               var childData = childSnapshot.val();
               if (childData.teacher_id == user_id && key2 == key) {
                   var subjectname = childData.subjectname;
                   $$('.subject-name').val(subjectname);

                   var content = "";
                   content += '<div style="background:#4caf50;font-size: 12px;padding:5px;color:#fff;"><span style="float:left;">SECTION</span><span style="float:right;">TIME</span> <br style="clear:both;"><span style="float:left;">'+childData.subjectname+'</span><span style="float:right;">'+childData.subjectschedule+'</span> <br style="clear:both;"></div>';

                   content += '<a href="grades.html" class="item-link"><div class="card" style="width:40%;float:left;"><center><h4>Grades</h4></center><p style="text-align: center;font-size: 12px;padding: 2px;">View and Edit Grades Records of Students</p></div></a>';  

                   content += '<a href="posts.html"><div class="card" style="width:40%;float:left;"><center><h4>Posts</h4></center><p style="text-align: center;font-size: 12px;padding: 2px;">View add and comment post for the subject</p></div></a>';

                   content += '<a href="seatplan.html"><div class="card" style="width:40%;float:left;"><center><h4>Seat Plan</h4></center><p style="text-align: center;font-size: 12px;padding: 2px;">View students seatplan</p></div> <br style="clear:both;"></a>';



                   myApp.modal({
                    title:  subjectname,
                    text: content,
                    buttons: [
                      {
                        text: 'Close',
                        onClick: function() {

                        }
                      },
                    ]
                  })
               }
           });
       });

      
}

$$(document).on('pageInit',function(e){
  var page = e.detail.page;
  if (page.name === 'subject') {
     $$('.hideonlogin').show();
     $$('.navbar').show();

     var userrole = $$('.loginrole').val();
     if (userrole == "teacher") {
        var user_id = $$('.statusbar-overlay').data('userid');
         var query = firebase.database().ref("subjects").orderByKey();
           query.once("value")
             .then(function(snapshot) {
                 snapshot.forEach(function(childSnapshot) {
                   var key = childSnapshot.key;
                   var childData = childSnapshot.val();
                   if (childData.teacher_id == user_id) {
                     $$('.subjectscontents').append('<li><a href="#" onclick="getSubjectData(\''+key+'\')" class="item-link item-content"><div class="item-inner"><div class="item-title">'+childData.subjectname+'</div><div class="item-after">'+childData.subjectcode+'</div></div></a></li>');
                   }
               });
           });
      }
      else if(userrole == "student")
      {

           var query2 = firebase.database().ref("users_subjects").orderByKey();
                   query2.once("value")
                   .then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                      var key = childSnapshot.key;
                      var childData = childSnapshot.val();

                        if (childData.fullname == $$('.fullname').val()) {
                              var subject_id = childData.subjectid;
                              var query3 = firebase.database().ref("subjects").orderByKey();
                                  query3.once("value")
                                  .then(function(snapshot) {
                                   snapshot.forEach(function(childSnapshot) {
                                    var key = childSnapshot.key;
                                    var childData = childSnapshot.val();
                                    if (key == subject_id ) {

                                      $$('.subjectscontents').append('<li class="item-content" onclick="viewGradesStudent(\''+$$('.fullname').val()+'\',\''+subject_id+'\')"><div class="item-inner"><div class="item-title">Subject Name</div><div class="item-after">'+childData.subjectname+'</div></div></li>');

                                      }
                                   });
                                });
                        }
                     });
                  });

      }   



   }
});   