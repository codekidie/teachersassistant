


function addChair()
{

        var optionTexts = [];
        $$(".chairitem").each(function() {
          optionTexts.push($$(this).text());
        });

        var largest = Math.max.apply(Math, optionTexts);
        largest++;

       $('#sortChairs').append('<div class="chairitem chair_num'+largest+'" onclick="showChairData('+largest+')" draggable="false">'+largest+'</div>');
        Sortable.create(sortChairs, {
          group: "sorting",
          sort: true
        });

        

}

function  seatPlanExistsCallback(subjectid, subjectname ,teacherid, student_fullname,selected_seat_number,exists)
{

    if (exists) {
        var ref = firebase.database().ref("seatplan"); //root reference to your data
        ref.orderByChild('subjectid').equalTo(subjectid)
         .once('value').then(function(snapshot) {
             snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              console.log(childData.student_fullname);
              if (childData.subjectid == subjectid && childData.student_fullname == student_fullname) {
                firebase.database().ref('seatplan/'+key).set({
                    subjectid : subjectid,
                    subjectname : subjectname,
                    teacherid : teacherid,
                    student_fullname    : student_fullname,
                    seat_number : selected_seat_number
                });

                  myApp.alert('Seat Plan Updated Success!', function () {
                         mainView.router.loadPage({ url: 'seatplan.html', ignoreCache: true, reload: true });
                         return true;
                  });
              }
          });
        });
    }
    else {
          var db = firebase.database();
          var ref = db.ref("seatplan");
          var newusers_subjects= ref.push();
          newusers_subjects.set({
            subjectid : subjectid,
            subjectname : subjectname,
            teacherid : teacherid,
            student_fullname    : student_fullname,
            seat_number : selected_seat_number
          });
           myApp.alert('Seat Plan Added Success!', function () {
                mainView.router.loadPage({ url: 'seatplan.html', ignoreCache: true, reload: true });
                return true;
          });

    }
}

function showChairData(selected_seat_number)
{

                myApp.closeModal('.popover');
                var subjectid = $$('.subject-data').val();
                var subjectname = $$('.subject-name').val();
                var teacherid = $$('.statusbar-overlay').data('userid');

                var content = "";
                content +='<a href="ratestudent.html" class="item-link" style="font-size:13px;"> Rate This Student </a>';

                var selectcontent = "";
                content += '<form>';
                content += '  <div class="list-block">';
                content += '    <ul>';
                content += '       <li class="item-content">';
                content += '        <div class="item-inner">';
                content += '          <div class="item-input">';

                content += '  <select id="student">';

                 var query = firebase.database().ref("seatplan").orderByKey();
                  query.once("value")
                    .then(function(snapshot) {
                      snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        var childData = childSnapshot.val();
                       console.log(childData);

                      if (childData.seat_number == selected_seat_number && childData.subjectid == subjectid) {
                       selectcontent += '<option value="'+childData.student_fullname+'" selected>'+childData.student_fullname+'</option>';

                        $$('.rate_student_fullname').val(childData.student_fullname);
                      }
                    });
                 });

                  var query1 = firebase.database().ref("users").orderByKey();
                  query1.once("value")
                    .then(function(snapshot) {
                      selectcontent += '<option value="None">None</option>';
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
                      content += '            <input type="text" readonly name="subjectname" id="subjectname" value="'+subjectname+'"';
                      content += '          </div>';
                      content += '        </div>';
                      content += '      </li>';
                      content += '    </ul>';
                      content += '  </div>';
                      content += '</form>';
              

                      myApp.modal({
                      title:  subjectname+" Seatplan",
                      text: content,
                      buttons: [
                        {
                          text: 'Close',
                          onClick: function() {

                          }
                        },{
                          text: 'Add',
                          onClick: function() {
                            var student_fullname = $$('#student').val();

                            var ref2 = firebase.database().ref("seatplan");
                            ref2.orderByChild('student_fullname').equalTo(student_fullname)
                                .once('value').then(function(snapshot) {
                                  var exists = (snapshot.val() !== null);
                                  seatPlanExistsCallback(subjectid, subjectname ,teacherid, student_fullname,selected_seat_number,exists);
                            });  

                          }
                        },{
                          text: 'Delete Chair',
                            onClick: function() {

                                  var ref = firebase.database().ref("seatplan"); //root reference to your data
                                  ref.orderByChild('subjectid').equalTo(subjectid)
                                   .once('value').then(function(snapshot) {
                                       snapshot.forEach(function(childSnapshot) {
                                        var key = childSnapshot.key;
                                        var childData = childSnapshot.val();
                                        if (childData.subjectid == subjectid && childData.seat_number == selected_seat_number) {
                                            firebase.database().ref("seatplan").child(key).remove().then(function() {
                                                $('.chair_num'+selected_seat_number).remove();
                                                $('#savechairs').trigger("click");
                                                myApp.alert('Seat Data Deleted Success!', function () {
                                                    mainView.router.loadPage({ url: 'seatplan.html', ignoreCache: true, reload: true });
                                                    return true;
                                                });
                                          });

                                            
                                        }
                                    });
                                  });

                            }
                          }
                      ]
                    });
                });
}


function  chairExistsCallback(subjectid, subjectname, teacherid , chairs_DOM , exists)
{

    if (exists) {
      // Edit chairs
          var ref = firebase.database().ref("chairs_element"); //root reference to your data
          ref.orderByChild('subjectid').equalTo(subjectid)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.subjectid == subjectid) {
                  firebase.database().ref('chairs_element/'+key).set({
                      subjectid : subjectid,
                      subjectname : subjectname,
                      teacherid : teacherid,
                      seatplan_element : chairs_DOM 
                  });

                  myApp.alert('Chair Updated Success!', function () {
                       mainView.goBack();
                  });
                  
                }
            });
          });

       
    }

    else {
            showloader();
            var db = firebase.database();
              var ref = db.ref("chairs_element");
              var  chairsDB= ref.push();
              chairsDB.set({
                subjectid : subjectid,
                subjectname : subjectname,
                teacherid : teacherid,
                seatplan_element : chairs_DOM
              });
            myApp.alert('Chair Added Success!', function () {
                 mainView.goBack();
            });
    }
}


function  attendanceExistsCallback(subjectid, subjectname, student_fullname, date_added , teacherid , status , exists)
{
    if (exists) {
          var ref = firebase.database().ref("attendance"); 
          ref.orderByChild('subjectid').equalTo(subjectid)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.subjectid == subjectid && childData.fullname == student_fullname && childData.date == date_added) {
                  firebase.database().ref('attendance/'+key).set({
                      subjectid   : subjectid,
                      subjectname : subjectname,
                      date        : date_added,
                      teacherid   : teacherid,
                      fullname    : student_fullname,
                      status      : status
                  });
                }
            });
          });

          myApp.alert('attendance Updated Success!', function () {
               mainView.goBack();
          });
    }

    else {
            showloader();
            var db = firebase.database();
            var ref = db.ref("attendance");
            var newusers_subjects= ref.push();
            newusers_subjects.set({
              subjectid : subjectid,
              subjectname : subjectname,
              date        : date_added,
              teacherid   : teacherid,
              fullname    : student_fullname,
              status      : status

            });
           
            myApp.alert('Attendance Added Success!', function () {
                 mainView.goBack();
            });
    }
}





function markAbsent(student_fullname,subjectid)
{
     var ref = firebase.database().ref("attendance");
      ref.orderByChild('fullname').equalTo(student_fullname)
          .once('value').then(function(snapshot) {
            var exists = (snapshot.val() !== null);
            var subjectname = $('.subject-name').val();
            var date_added  = $('#date_today').text();
            var date_added  = $('#date_today').text();
            var teacherid   = $('.statusbar-overlay').attr('data-userid');
            attendanceExistsCallback(subjectid, subjectname, student_fullname, date_added , teacherid , "Absent" , exists);
            
            $('#tod_'+student_fullname).text(student_fullname+' (Absent)');
      });
}


function markPresent(student_fullname,subjectid)
{
      var ref = firebase.database().ref("attendance");
      ref.orderByChild('fullname').equalTo(student_fullname)
          .once('value').then(function(snapshot) {
            var exists = (snapshot.val() !== null);
            var subjectname = $('.subject-name').val();
            var date_added  = $('#date_today').text();
            var date_added  = $('#date_today').text();
            var teacherid   = $('.statusbar-overlay').attr('data-userid');
            attendanceExistsCallback(subjectid, subjectname, student_fullname, date_added , teacherid , "Present" , exists);
            $('#tod_'+student_fullname).text(student_fullname+' (Present)');
      });
}




$$(document).on('pageInit',function(e){
    var page = e.detail.page;
    if (page.name === 'seatplan') {

        $$('.hideonlogin').show();
        $$('.navbar').show();
        myApp.hidePreloader();
        Sortable.create(sortChairs, {
          group: "sorting",
          sort: true
        });



        var subjectid = $$('.subject-data').val();
        var subjectname = $$('.subject-name').val();
        var teacherid = $$('.statusbar-overlay').data('userid');
        $('#subjectheadername').text(subjectname+' Seatplan');
        var ref = firebase.database().ref("chairs_element"); //root reference to your data
          ref.orderByChild('subjectid').equalTo(subjectid)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                $$('#sortChairs').html(childData.seatplan_element);
               
            });
          });


        $$('#savechairs').click(function() {
            var ref = firebase.database().ref("chairs_element");
            ref.orderByChild('subjectid').equalTo(subjectid)
                .once('value').then(function(snapshot) {
                  var chairs_DOM = $$("#sortChairs").html();
                  var exists = (snapshot.val() !== null);
                  chairExistsCallback(subjectid, subjectname, teacherid , chairs_DOM , exists);
            });
        });

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        $$('#date_today').text(date);


         var ref = firebase.database().ref("seatplan"); //root reference to your data
          ref.orderByChild('subjectid').equalTo(subjectid)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                   var content = '<li class="swipeout">';
                    content += '<div class="swipeout-content">';
                    content += '    <div class="item-content">';
                    content += '      <div class="item-media">Seat # :'+childData.seat_number+'</div>';
                    content += '      <div class="item-inner" id="tod_'+childData.student_fullname+'">'+childData.student_fullname+'</div>';
                    content += '    </div>';
                    content += ' </div>';
                    content += '  <div class="swipeout-actions-right">';
                    content += '    <a href="#" class="bg-red"   onclick="markAbsent(\''+childData.student_fullname+'\',\''+subjectid+'\')">Absent</a>';
                    content += '    <a href="#" class="bg-green" onclick="markPresent(\''+childData.student_fullname+'\',\''+subjectid+'\')">Present</a>';
                    content += '  </div>';
                    content += ' </li>';

                  $$('#swipe_attendance').append(content);
            });
          });
     }
});   
