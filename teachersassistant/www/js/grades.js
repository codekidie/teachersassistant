function   gradeExistsCallback(studentname,teacherid,subjectid,prelim_lec_pqz,prelim_lec_pcs,prelim_lec_pexam,prelim_lab_pexp,prelim_lab_pcs,prelim_lab_pexam,midterm_lec_pexp,midterm_lec_pcs,midterm_lec_pexam,midterm_lab_mexp,midterm_lab_pcs,midterm_lab_mexam,final_lec_fqz,final_lec_fcs,final_lec_fexam,final_lec_fexp,very_final_lec_fcs,very_final_lec_fexam,exists)
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
                        prelim_lec_pqz   :prelim_lec_pqz,
                        prelim_lec_pcs   :prelim_lec_pcs,
                        prelim_lec_pexam :prelim_lec_pexam,
                        prelim_lab_pexp  :prelim_lab_pexp,
                        prelim_lab_pcs   :prelim_lab_pcs,
                        prelim_lab_pexam :prelim_lab_pexam,
                        midterm_lec_pexp :midterm_lec_pexp,
                        midterm_lec_pcs  :midterm_lec_pcs,
                        midterm_lec_pexam : midterm_lec_pexam,
                        midterm_lab_mexp : midterm_lab_mexp,
                        midterm_lab_pcs : midterm_lab_pcs,
                        midterm_lab_mexam : midterm_lab_mexam, 
                        final_lec_fqz : final_lec_fqz,
                        final_lec_fcs : final_lec_fcs,
                        final_lec_fexam : final_lec_fexam,
                        final_lec_fexp : final_lec_fexp,
                        very_final_lec_fcs : very_final_lec_fcs,
                        very_final_lec_fexam :  very_final_lec_fexam,
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
                        prelim_lec_pqz   :prelim_lec_pqz,
                        prelim_lec_pcs   :prelim_lec_pcs,
                        prelim_lec_pexam :prelim_lec_pexam,
                        prelim_lab_pexp  :prelim_lab_pexp,
                        prelim_lab_pcs   :prelim_lab_pcs,
                        prelim_lab_pexam :prelim_lab_pexam,
                        midterm_lec_pexp :midterm_lec_pexp,
                        midterm_lec_pcs  :midterm_lec_pcs,
                        midterm_lec_pexam : midterm_lec_pexam,
                        midterm_lab_mexp : midterm_lab_mexp,
                        midterm_lab_pcs : midterm_lab_pcs,
                        midterm_lab_mexam : midterm_lab_mexam, 
                        final_lec_fqz : final_lec_fqz,
                        final_lec_fcs : final_lec_fcs,
                        final_lec_fexam : final_lec_fexam,
                        final_lec_fexp : final_lec_fexp,
                        very_final_lec_fcs : very_final_lec_fcs,
                        very_final_lec_fexam :  very_final_lec_fexam,
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
            $$('#prelim_lec_pqz').val(childData.prelim_lec_pqz );
            $$('#prelim_lec_pcs').val(childData.prelim_lec_pcs );
            $$('#prelim_lec_pexam').val(childData.prelim_lec_pexam);

            var prelim_lec_pqzresult = 0.40 * Number(childData.prelim_lec_pqz);
            var prelim_lec_pcsresult = 0.10 * Number(childData.prelim_lec_pcs);
            var prelim_lec_pexamresult = 0.50 * Number(childData.prelim_lec_pexam);

            var total_prelim_res = Number(prelim_lec_pqzresult) + Number(prelim_lec_pcsresult) + Number(prelim_lec_pexamresult);
             total_prelim_res = parseFloat(total_prelim_res).toFixed(2); 

            $$('#prelimlec_data').text(total_prelim_res);

          
            $$('#prelim_lab_pexp').val(childData.prelim_lab_pexp );
            $$('#prelim_lab_pcs').val(childData.prelim_lab_pcs );
            $$('#prelim_lab_pexam').val(childData.prelim_lab_pexam );

            var prelim_lab_pexp = 0.40 * Number(childData.prelim_lab_pexp);
            var prelim_lab_pcs = 0.10 * Number(childData.prelim_lab_pcs);
            var prelim_lab_pexam = 0.50 * Number(childData.prelim_lab_pexam);

            var total_prelim_lab_res = Number(prelim_lab_pexp) + Number(prelim_lab_pcs) + Number(prelim_lab_pexam);
             total_prelim_lab_res = parseFloat(total_prelim_lab_res).toFixed(2); 

            $$('#prelimlab_data').text(total_prelim_lab_res);


            $$('#midterm_lec_pexp').val(childData.midterm_lec_pexp );
            $$('#midterm_lec_pcs').val(childData.midterm_lec_pcs );
            $$('#midterm_lec_pexam').val(childData.midterm_lec_pexam );


            var midterm_lec_pexp = 0.40 * Number(childData.midterm_lec_pexp);
            var midterm_lec_pcs = 0.10 * Number(childData.midterm_lec_pcs);
            var midterm_lec_pexam = 0.50 * Number(childData.midterm_lec_pexam);

            var total_midterm_lec_res = Number(midterm_lec_pexp) + Number(midterm_lec_pcs) + Number(midterm_lec_pexam);
             total_midterm_lec_res = parseFloat(total_midterm_lec_res).toFixed(2); 

            $$('#midtermlec_data').text(total_midterm_lec_res);

            $$('#midterm_lab_mexp').val(childData.midterm_lab_mexp );
            $$('#midterm_lab_pcs').val(childData.midterm_lab_pcs );
            $$('#midterm_lab_mexam').val(childData.midterm_lab_mexam );


            var midterm_lab_mexp = 0.40 * Number(childData.midterm_lab_mexp);
            var midterm_lab_pcs = 0.10 * Number(childData.midterm_lab_pcs);
            var midterm_lab_mexam = 0.50 * Number(childData.midterm_lab_mexam);

            var total_midterm_lab_res = Number(midterm_lab_mexp) + Number(midterm_lab_pcs) + Number(midterm_lab_mexam);
             total_midterm_lab_res = parseFloat(total_midterm_lab_res).toFixed(2); 
            $$('#midtermlab_data').text(total_midterm_lab_res);
            
            $$('#final_lec_fqz').val(childData.final_lec_fqz );
            $$('#final_lec_fcs').val(childData.final_lec_fcs );
            $$('#final_lec_fexam').val(childData.final_lec_fexam );


            var final_lec_fqz = 0.40 * Number(childData.final_lec_fqz);
            var final_lec_fcs = 0.10 * Number(childData.final_lec_fcs);
            var final_lec_fexam = 0.50 * Number(childData.final_lec_fexam);

            var total_final_lec_res = Number(final_lec_fqz) + Number(final_lec_fcs) + Number(final_lec_fexam);
            total_final_lec_res = parseFloat(total_final_lec_res).toFixed(2); 
            $$('#final_lec_data').text(total_final_lec_res);
            
            $$('#final_lec_fexp').val(childData.final_lec_fexp );
            $$('#very_final_lec_fcs').val(childData.very_final_lec_fcs );
            $$('#very_final_lec_fexam').val(childData.very_final_lec_fexam );


            var final_lec_fexp = 0.40 * Number(childData.final_lec_fexp);
            var very_final_lec_fcs = 0.10 * Number(childData.very_final_lec_fcs);
            var very_final_lec_fexam = 0.50 * Number(childData.very_final_lec_fexam);

            var final_lab_data = Number(final_lec_fexp) + Number(very_final_lec_fcs) + Number(very_final_lec_fexam);
            final_lab_data = parseFloat(final_lab_data).toFixed(2); 
            $$('#final_lab_data').text(final_lab_data);



            var final_prelim_res =  0.60 * Number(total_prelim_res);
            var final_prelim_lab =  0.40 * Number(total_prelim_lab_res);
            var overall_prelim_grade = parseFloat(final_prelim_res + final_prelim_lab).toFixed(2); 
                  
            var final_midterm_res =  0.60 * Number(total_midterm_lec_res);
            var final_midterm_lab =  0.40 * Number(total_midterm_lab_res);
            var overall_midterm_grade = parseFloat(final_midterm_res + final_midterm_lab).toFixed(2); 

            var final_final_res =  0.60 * Number(total_final_lec_res);
            var final_final_lab =  0.40 * Number(final_lab_data);
            var overall_final_grade = parseFloat(final_final_res + final_final_lab).toFixed(2); 

            $$('#PGrade').text(overall_prelim_grade);
            $$('#MGrade').text(overall_midterm_grade);
            $$('#FGrade').text(overall_final_grade);

             
            var final_prelim_rate =  0.30 * Number(overall_prelim_grade);
            var final_midterm_rate =  0.30 * Number(overall_midterm_grade);
            var final_final_rate =  0.40 * Number(overall_final_grade);

            var very_final_last_grade = parseFloat(final_prelim_rate + final_midterm_rate + final_final_rate).toFixed(2); 
            
            $$('#OFGrade').text(very_final_last_grade);

            if (very_final_last_grade <= 100 && very_final_last_grade >= 96) {
               $$('#star_rate').html("<img src='./img/five_star.png' style='width:120px;'> <br> A+");
            }
            else if(very_final_last_grade <= 95 && very_final_last_grade >= 91)
            {
               $$('#star_rate').html("<img src='./img/four_star.png' style='width:120px;'> <br> A");
            }
            else if(very_final_last_grade <= 90 && very_final_last_grade > 85)
            {
               $$('#star_rate').html("<img src='./img/four_star.png' style='width:120px;'> <br> A-");
            }

              else if(very_final_last_grade <= 85 && very_final_last_grade >= 81)
            {
               $$('#star_rate').html("<img src='./img/3_star.png' style='width:120px;'> <br> B+");

            }

            else if(very_final_last_grade <= 80 && very_final_last_grade >= 75)
            {
               $$('#star_rate').html("<img src='./img/3_star.png' style='width:120px;'> <br> B");

            }

            else if(very_final_last_grade <= 74 && very_final_last_grade >= 63)
            {
          
               $$('#star_rate').html("<img src='./img/2star.png' style='width:120px;'> <br> C+");


            }

            else if(very_final_last_grade <= 62 && very_final_last_grade >= 57)
            {
               $$('#star_rate').html("<img src='./img/2star.png' style='width:120px;'> <br> C");

            }

            else if(very_final_last_grade <= 56 && very_final_last_grade >= 50)
            {
               $$('#star_rate').html("<img src='./img/1star.png' style='width:120px;'> <br> C");

            }

            else{
               $$('#star_rate').html("<img src='./img/0star.png' style='width:120px;'> <br> C");
             

            }
            
        }
    });
  });
      content += '<table class="gradestable" id="printme">';
      content += '<thead><tr><td colspan="4" style="text-align:center;">'+studentname + '\'s Grades </td></tr></thead>';
      content += ' <tbody>';
      content += '<tr><td colspan="4" style="text-align:center;">Prelim Lec</td></tr>';
      content += '<tr><td>PQZ</td><td>PCS</td><td>PEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="prelim_lec_pqz" style="width:30px;"></td><td><input type="text" id="prelim_lec_pcs" style="width:30px;"></td><td><input type="text" id="prelim_lec_pexam" style="width:30px;"></td><td id="prelimlec_data">   </td></tr>';

        content += '<tr><td colspan="4" style="text-align:center;">Prelim Lab</td></tr>';
      content += '<tr><td>PEXP</td><td>PCS</td><td>PEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="prelim_lab_pexp" style="width:30px;"></td><td><input type="text" id="prelim_lab_pcs" style="width:30px;"></td><td><input type="text" id="prelim_lab_pexam" style="width:30px;"></td><td id="prelimlab_data"></td></tr>';


      content += '<tr><td colspan="4" style="text-align:center;">Midterm Lec</td></tr>';
      content += '<tr><td>PEXP</td><td>PCS</td><td>PEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="midterm_lec_pexp" style="width:30px;"></td><td><input type="text" id="midterm_lec_pcs" style="width:30px;"></td><td><input type="text" id="midterm_lec_pexam" style="width:30px;"></td><td id="midtermlec_data"></td></tr>';

      content += '<tr><td colspan="4" style="text-align:center;">Midterm Lab</td></tr>';
      content += '<tr><td>MEXP</td><td>MCS</td><td>MEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="midterm_lab_mexp" style="width:30px;"></td><td><input type="text" id="midterm_lab_pcs" style="width:30px;"></td><td><input type="text" id="midterm_lab_mexam" style="width:30px;"></td><td id="midtermlab_data"></td></tr>';


           content += '<tr><td colspan="4" style="text-align:center;">Final Lec</td></tr>';
      content += '<tr><td>FQZ</td><td>FCS</td><td>FEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="final_lec_fqz" style="width:30px;"></td><td><input type="text" id="final_lec_fcs" style="width:30px;"></td><td><input type="text" id="final_lec_fexam" style="width:30px;"></td><td id="final_lec_data"></td></tr>';

           content += '<tr><td colspan="4" style="text-align:center;">Final Lab</td></tr>';
      content += '<tr><td>FEXP</td><td>FCS</td><td>FEXAM</td><td>GRADE</td></tr>';
      content += '<tr><td><input type="text" id="final_lec_fexp" style="width:30px;"></td><td><input type="text" id="very_final_lec_fcs" style="width:30px;"></td><td><input type="text" id="very_final_lec_fexam" style="width:30px;"></td><td id="final_lab_data"></td></tr>';



      content += '<tr><td colspan="4" style="text-align:center;">Listing Total Grades</td></tr>';
      content += '<tr><td colspan="4" style="text-align:center;" id="star_rate"></td></tr>';
      content += '<tr><td>PGrade</td><td>MGrade</td><td>FGrade</td><td>OFGrade</td></tr>';
      content += '<tr><td id="PGrade"></td><td id="MGrade"></td><td id="FGrade"></td><td id="OFGrade"></td></tr>';



     content += ' </tbody></table>';


      myApp.modal({
        title: studentname + '\'s Grades',
        text: content,
        buttons: [
          {
            text: 'Close',
            onClick: function () {
            
            }
          },
           {
            text: 'Print',
            onClick: function () {
                printme();
            }
          },

          {
            text: 'Submit',
            onClick: function () {
              var prelim_lec_pqz  = $$('#prelim_lec_pqz').val();
              var prelim_lec_pcs  = $$('#prelim_lec_pcs').val();
              var prelim_lec_pexam  = $$('#prelim_lec_pexam').val();

              var prelim_lab_pexp  = $$('#prelim_lab_pexp').val();
              var prelim_lab_pcs  = $$('#prelim_lab_pcs').val();
              var prelim_lab_pexam  = $$('#prelim_lab_pexam').val();

              var midterm_lec_pexp  = $$('#midterm_lec_pexp').val();
              var midterm_lec_pcs  = $$('#midterm_lec_pcs').val();
              var midterm_lec_pexam  = $$('#midterm_lec_pexam').val();

              var midterm_lab_mexp  = $$('#midterm_lab_mexp').val();
              var midterm_lab_pcs  = $$('#midterm_lab_pcs').val();
              var midterm_lab_mexam  = $$('#midterm_lab_mexam').val();


              var final_lec_fqz  = $$('#final_lec_fqz').val();
              var final_lec_fcs  = $$('#final_lec_fcs').val();
              var final_lec_fexam  = $$('#final_lec_fexam').val();

              var final_lec_fexp  = $$('#final_lec_fexp').val();
              var very_final_lec_fcs  = $$('#very_final_lec_fcs').val();
              var very_final_lec_fexam  = $$('#very_final_lec_fexam').val();



          

              var ref = firebase.database().ref("quiztbl");
              ref.orderByChild('subjectid').equalTo(subjectid)
                  .once('value').then(function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    gradeExistsCallback(studentname,teacherid,subjectid,prelim_lec_pqz,prelim_lec_pcs,prelim_lec_pexam,prelim_lab_pexp,prelim_lab_pcs,prelim_lab_pexam,midterm_lec_pexp,midterm_lec_pcs,midterm_lec_pexam,midterm_lab_mexp,midterm_lab_pcs,midterm_lab_mexam,final_lec_fqz,final_lec_fcs,final_lec_fexam,final_lec_fexp,very_final_lec_fcs,very_final_lec_fexam,exists);
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