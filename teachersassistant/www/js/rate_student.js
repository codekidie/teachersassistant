
function  rateExistsCallback(subjectname, studentfullname ,rate_text, rate, exists)
{

    if (exists) {
          // Edit chairs
          var ref = firebase.database().ref("rate_student"); //root reference to your data
          ref.orderByChild('subjectname').equalTo(subjectname)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.subjectname == subjectname && childData.studentfullname == studentfullname) {
                  firebase.database().ref('rate_student/'+key).set({
                        studentfullname : studentfullname,
                        subjectname     : subjectname,
                        rate            : rate,
                        rate_text       : rate_text
                  });
                }
            });
          });
    }

    else {
            showloader();
            var db = firebase.database();
              var ref = db.ref("rate_student");
              var  chairsDB= ref.push();
              chairsDB.set({
                studentfullname : studentfullname,
                subjectname     : subjectname,
                rate            : rate,
                rate_text       : rate_text
              });
            myApp.alert('Rate Added Success!', function () {});
    }
}




function submitRate()
{
    var starval        = $('#starval').val();
    var rate_text      = $('#rate_text').val();
    var studentfullname       = $('.rate_student_fullname').val();
    var subject_name   = $('.subject-name').val();

     var ref = firebase.database().ref("rate_student");
    ref.orderByChild('studentfullname').equalTo(studentfullname)
        .once('value').then(function(snapshot) {
            var exists = (snapshot.val() !== null);
            rateExistsCallback(subject_name, studentfullname ,rate_text, starval, exists);
    });
    
}

$$(document).on('pageInit',function(e){
  var page = e.detail.page;
  if (page.name === 'ratestudent') {
     $$('.hideonlogin').show();
     $$('.navbar').show();
       myApp.hidePreloader();
       myApp.closeModal(); 

       var fullname = $('.rate_student_fullname').val();
       $$('#rate_name_data').text(fullname);
   }
});   