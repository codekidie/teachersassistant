function addAttendance()
{   

      myApp.closeModal('.popover');
      var subjectid = $$('.subject-data').val();
      var subjectname = $$('.subject-name').val();
      var teacherid = $$('.statusbar-overlay').data('userid');

      var content = '<div style="height: 350px;overflow: scroll;">';
      var selectcontent = "";
      content += '<form>';
      content += '  <div class="list-block">';
      content += '    <ul>';
      content += '       <li class="item-content">';
      content += '        <div class="item-inner">';
      content += '          <div class="item-input">';
      content += '           <select id="student">';

      var query = firebase.database().ref("users").orderByKey();
      query.once("value")
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if (childData.role != 'teacher') {
             selectcontent += '<option value="'+childData.fullname+'">'+childData.fullname+'</option>';
            }
        });
            content +=  selectcontent;
            content += '</select>';
            content += '          </div>';
            content += '        </div>';
            content += '      </li>';
            content += '       <li class="item-content">';
            content += '        <div class="item-inner">';
            content += '          <div class="item-input">';
            content += '            <input type="text" name="subjectname" id="subjectname" value="'+subjectname+'"';
            content += '          </div>';
            content += '        </div>';
            content += '      </li>';

            content += '       <li class="item-content">';
            content += '        <div class="item-inner">';
            content += '          <div class="item-input">';
            content += '          <input type="date" name="calendardate" id="dateadded" placeholder="Date"/>';
            content += '          </div>';
            content += '        </div>';
            content += '      </li>';

            content += '    </ul>';
            content += '  </div>';
            content += '</form>';
            content += '  </div>';



            myApp.modal({
            title:  subjectname+" Attendance",
            text: content,
            buttons: [
              {
                text: 'Close',
                onClick: function() {
                 mainView.router.loadPage({url:'grades.html', ignoreCache:true, reload:true })

                }
              },{
                text: 'Add',
                onClick: function() {
                    var db = firebase.database();
                    var ref = db.ref("attendance");
                    var newusers_subjects= ref.push();
                    newusers_subjects.set({
                      subjectid : subjectid,
                      subjectname : subjectname,
                      date : $$('#dateadded').val(),
                      teacherid : teacherid,
                      fullname    : $$('#student').val()
                    });

                    myApp.alert('Student Added Successfully!', function () {
                          mainView.router.loadPage({url:'grades.html', ignoreCache:true, reload:true });
                    });
                }
              }
            ]
          });
      });
               
}


$$(document).on('pageInit',function(e){
    var page = e.detail.page;
    if (page.name === 'attendance') {
       $$('.hideonlogin').show();
       $$('.navbar').show();
       myApp.hidePreloader();
   
     }

      if (page.name === 'studentattendance') {
         $$('.hideonlogin').show();
         $$('.navbar').show();
         myApp.hidePreloader();
         myApp.closeModal(); 
         var fullname = $$('.fullname').val();

          var ref = firebase.database().ref("attendance"); //root reference to your data
          ref.orderByChild('fullname').equalTo(fullname)
           .once('value').then(function(snapshot) {
            var content  = '';
                content += '<ul>';
                    console.log('naa');

              snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                  if (childData.subjectname == $$('.subject-name').val()) {
                    console.log('naa');
                     content += ' <li class="item-content">';
                     content += '  <div class="item-inner">';
                     content += '     <div class="item-title-row">';
                     content += '       <div class="item-title">Date Present : '+childData.date+'</div>';
                     content += '     </div>';
                     content += '    </div>';
                     content += ' </li>';
                  } 
              });
                    console.log('naa');

                content += ' </ul>';
                $$('#studentAttendance-data').html(content);
          });
      
  
      }
});   
