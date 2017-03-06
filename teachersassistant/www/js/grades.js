function   gradeExistsCallback(studentname,teacherid,subjectid,prelim_score,midterm_score,finals_score,prelim_date,midterm_date,finals_date,exists)
{

    if (exists) {
      // Edit chairs
          var ref = firebase.database().ref("quiztbl"); //root reference to your data
          ref.orderByChild('subjectid').equalTo(subjectid)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.subjectid == subjectid && childData.studentname == studentname ) {
                  firebase.database().ref('quiztbl/'+key).set({
                        subjectid     : subjectid,
                        teacherid     : teacherid,
                        studentname   : studentname,
                        prelim_score  : prelim_score,
                        midterm_score : midterm_score,
                        finals_score  : finals_score,
                        prelim_date   : prelim_date,
                        midterm_date  : midterm_date,
                        finals_date   : finals_date
                  });
                }
            });
          });

          myApp.alert('Grade Updated Success!', function () { });
    }

    else {
            showloader();
           
              var db = firebase.database();
              var ref = db.ref("quiztbl");
              var newQuiz = ref.push();
              newQuiz.set({
                    subjectid     : subjectid,
                    teacherid     : teacherid,
                    studentname   : studentname,
                    prelim_score  : prelim_score,
                    midterm_score : midterm_score,
                    finals_score  : finals_score,
                    prelim_date   : prelim_date,
                    midterm_date  : midterm_date,
                    finals_date   : finals_date
              });

            myApp.alert('Grade Added Success!', function () {
                 mainView.goBack();
            });
    }
}




function addGrade() {
  myApp.closeModal('.popover');
  var subjectid = $$('.subject-data').val();
  var subjectname = $$('.subject-name').val();
  var teacherid = $$('.statusbar-overlay').data('userid');

  var content = '<div style="height: 350px;overflow: scroll;">';
  var contentselect = "";
  content += '<form>';
  content += '  <div class="list-block">';
  content += '    <ul>';
  content += '       <li class="item-content">';
  content += '        <div class="item-inner">';
  content += '          <div class="item-input">';
  content += '           <select id="student">';

  var query = firebase.database().ref("users_subjects").orderByKey();
  query.once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.teacherid == teacherid && childData.subjectid == subjectid) {
          contentselect += '<option value="' + childData.fullname + '">' + childData.fullname + '</option>';

        }
      });
      content += contentselect;
      content += '           </select>';
      content += '          </div>';
      content += '        </div>';
      content += '      </li>';

      content += '       <li class="item-content">';
      content += '        <div class="item-inner">';
      content += '          <div class="item-input">';
      content += '            <input type="text" name="score" id="score" placeholder="Input Score Here!"/>';
      content += '          </div>';
      content += '        </div>';
      content += '      </li>';


      content += '       <li class="item-content">';
      content += '        <div class="item-inner">';
      content += '          <div class="item-input">';
      content += '           <select id="sem"><option>Prelim</option><option>Midterm</option><option>Finals</option></select>';
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
      content += '</div>';

      myApp.modal({
        title: subjectname,
        text: content,
        buttons: [
          {
            text: 'Close',
            onClick: function () {
              mainView.router.loadPage({ url: 'grades.html', ignoreCache: true, reload: true });

            }
          }, {
            text: 'Add',
            onClick: function () {

              
              var student_add = $$('#student').val();


              if (!student_add) {
                myApp.alert('Score Not Added Something Went Wrong Please Fillup All Data in The Form!', function () {
                  mainView.router.loadPage({ url: 'grades.html', ignoreCache: true, reload: true });
                });
              } else {
             
                  var score = $$('#score').val();
                  var date = $$('#dateadded').val();
                  var quizsem = $$('#sem').val();
                  var teacherid = teacherid;
                  var userid = student_add;
                  var ref = firebase.database().ref("quiztbl");
                  ref.orderByChild('subjectid').equalTo(subjectid)
                      .once('value').then(function(snapshot) {
                      var exists = (snapshot.val() !== null);
                      var subjectid = $$('.subject-data').val();
                      var subjectname = $$('.subject-name').val();
                      var teacherid = $$('.statusbar-overlay').data('userid');
                       gradeExistsCallback(subjectid,score,date,quizsem,teacherid,userid, exists);
                  });
              }
            }
          }
        ]
      })
    });


}


//Students Grades
function viewGradesStudent(studentname, subjectid) {

  var content = '<div style="height: 350px;overflow: scroll;">';
  var teacherid = $$('.statusbar-overlay').data('userid');

  var ref = firebase.database().ref("quiztbl"); //root reference to your data
  ref.orderByChild('subjectid').equalTo(subjectid)
   .once('value').then(function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.subjectid == subjectid && childData.studentname == studentname ) {
            $$('#prelim_date').val(childData.prelim_date );
            $$('#midterm_date').val(childData.midterm_date );
            $$('#finals_date').val(childData.finals_date );
            $$('#prelim_score').val(childData.prelim_score );
            $$('#midterm_score').val(childData.midterm_score );
            $$('#finals_score').val(childData.finals_score );
        }
    });
  });

      content += ' <div class="content-block-title">Prelim Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';

      content += '       <li class="item-content" style="font-size:13px;">';
      content += ' <input type="date" id="prelim_date" value="" readonly>  </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="prelim_score" value="" placeholder="Prelim Score" readonly>';
      content += '      </li>';
      content += '    </ul>';
      content += '  </div>';
      content += ' <div class="content-block-title">Midterm Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';
      content += '       <li class="item-content" style="font-size:13px;">';
      content += '  <input type="date" id="midterm_date" value="" readonly>  </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="midterm_score" value=""  placeholder="Midterm Score" readonly>';
      content += '      </li>';

      content += '    </ul>';
      content += '  </div>';


      content += ' <div class="content-block-title">Finals Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';

    
      content += '       <li class="item-content" style="font-size:13px;">';
      content += '  <input type="date" id="finals_date" value="" readonly> </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="finals_score" value=""  placeholder="Finals Score" readonly>';
          content += '      </li>';
      

      content += '    </ul>';
      content += '  </div>';
      content += '  </div>';




      myApp.modal({
        title: studentname + '\'s Grades',
        text: content,
        buttons: [
          {
            text: 'Close',
            onClick: function () {
             
            }
          }
        ]
      });
}




//Teacher Grades
function viewGrades(studentname, subjectid) {

  var content = '<div style="height: 350px;overflow: scroll;">';
  var teacherid = $$('.statusbar-overlay').data('userid');

  var ref = firebase.database().ref("quiztbl"); //root reference to your data
  ref.orderByChild('subjectid').equalTo(subjectid)
   .once('value').then(function(snapshot) {
       snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        if (childData.subjectid == subjectid && childData.studentname == studentname ) {
            $$('#prelim_date').val(childData.prelim_date );
            $$('#midterm_date').val(childData.midterm_date );
            $$('#finals_date').val(childData.finals_date );
            $$('#prelim_score').val(childData.prelim_score );
            $$('#midterm_score').val(childData.midterm_score );
            $$('#finals_score').val(childData.finals_score );
        }
    });
  });

      content += ' <div class="content-block-title">Prelim Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';

      content += '       <li class="item-content" style="font-size:13px;">';
      content += ' <input type="date" id="prelim_date" value="">  </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="prelim_score" value="" placeholder="Prelim Score">';
      content += '      </li>';
      content += '    </ul>';
      content += '  </div>';
      content += ' <div class="content-block-title">Midterm Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';
      content += '       <li class="item-content" style="font-size:13px;">';
      content += '  <input type="date" id="midterm_date" value="">  </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="midterm_score" value=""  placeholder="Midterm Score">';
      content += '      </li>';

      content += '    </ul>';
      content += '  </div>';


      content += ' <div class="content-block-title">Finals Grades</div>';
      content += '  <div class="list-block">';
      content += '    <ul>';

    
      content += '       <li class="item-content" style="font-size:13px;">';
      content += '  <input type="date" id="finals_date" value=""> </li>  <li class="item-content" style="font-size:13px;">  <input type="text" id="finals_score" value=""  placeholder="Finals Score">';
          content += '      </li>';
      

      content += '    </ul>';
      content += '  </div>';
      content += '  </div>';




      myApp.modal({
        title: studentname + '\'s Grades',
        text: content,
        buttons: [
          {
            text: 'Close',
            onClick: function () {
            
            }
          },{
            text: 'Submit',
            onClick: function () {
              var prelim_score  = $$('#prelim_score').val();
              var midterm_score = $$('#midterm_score').val();
              var finals_score  = $$('#finals_score').val();

              var prelim_date   = $$('#prelim_date').val();
              var midterm_date  = $$('#midterm_date').val();
              var finals_date   = $$('#finals_date').val();

              var ref = firebase.database().ref("quiztbl");
              ref.orderByChild('subjectid').equalTo(subjectid)
                  .once('value').then(function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    gradeExistsCallback(studentname,teacherid,subjectid,prelim_score,midterm_score,finals_score,prelim_date,midterm_date,finals_date,exists);
              });
            }
          }
        ]
      });
}

$$(document).on('pageInit', function (e) {
  var page = e.detail.page;
  if (page.name === 'grades') {
    $$('.hideonlogin').show();
    $$('.navbar').show();
    myApp.hidePreloader();

    var mySearchbar = $$('.searchbar')[0].f7Searchbar;
    var teacherid = $$('.statusbar-overlay').data('userid');
    var contendata = "";
    var subjectid = $$('.subject-data').val();

    


    var query = firebase.database().ref("users_subjects").orderByKey();
    query.once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childData.teacherid == teacherid && childData.subjectid == subjectid) {

            contendata += '       <li class="item-content">';
            contendata += '           <div class="item-inner"><div class="item-title" style="    padding-left: 10px !important;" id="' + childData.fullname + '" onclick="viewGrades(\'' + childData.fullname + '\',\'' + $$('.subject-data').val() + '\')">' + childData.fullname + '</div></div>';
            contendata += '      </li>';

          }
        });
        $$("#content_data").html(contendata);
      });
  }
});   