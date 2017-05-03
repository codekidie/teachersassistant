// Initialize your app
var myApp = new Framework7({
    modalTitle:'Teachers Assistant',
    pushState:true,
    material:true,
    // swipePanel: 'left',
    onAjaxStart:function(xhr){
      myApp.showPreloader();

    },
    onAjaxComplete:function(xhr){
       myApp.hidePreloader();
    }
});



// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCache:false,
});



function onConfirm(button) {
    if(button==2){//If User selected No, then we just do nothing
        return;
    }else{
        navigator.app.exitApp();// Otherwise we quit the app.
    }
}

   function deactivate(teacher_key)
    {
       myApp.modal({
                      title:"Activation Form",
                      text: '',
                      buttons: [
                       {
                          text: 'Cancel',
                          onClick: function() {
                             
                          }
                        },
                        {
                          text: 'Deactivate',
                          onClick: function() {
                              var ref = firebase.database().ref("users"); //root reference to your data
                              ref.orderByKey().equalTo(teacher_key)
                               .once('value').then(function(snapshot) {
                                   snapshot.forEach(function(childSnapshot) {
                                    var key = childSnapshot.key;
                                    var childData = childSnapshot.val();
                                    if (key == teacher_key) {
                                      firebase.database().ref('users/'+key).update({
                                        active: 0
                                      });
                                        myApp.alert('Teacher Deactivated Successfully', 'Activation Form');
                                    }
                                });
                              });
                          }
                        },{
                          text: 'Active',
                          onClick: function() {
                              var ref = firebase.database().ref("users"); //root reference to your data
                              ref.orderByKey().equalTo(teacher_key)
                               .once('value').then(function(snapshot) {
                                   snapshot.forEach(function(childSnapshot) {
                                    var key = childSnapshot.key;
                                    var childData = childSnapshot.val();
                                    if (key == teacher_key) {
                                      firebase.database().ref('users/'+key).update({
                                        active: 1
                                      });
                                        myApp.alert('Teacher Set To Active Successfully', 'Activation Form');
                                    }
                                });
                              });

                          }
                        }
                      ]
                    });
    }

function changePassword()
{

    
    var content = '<div class="list-block"><ul><li><input type="password" placeholder="New Password" id="newpassword"></li> </ul></div>';

    myApp.modal({
        title:  "Change Password Form",
        text: content,
        buttons: [
          {
            text: 'Cancel',
            onClick: function() {

            }
          },{
            text: 'Submit',
            onClick: function() {
               var user_id = $$('.statusbar-overlay').data('userid');

                var ref = firebase.database().ref("users"); //root reference to your data
                ref.orderByKey().equalTo(user_id)
                 .once('value').then(function(snapshot) {
                     snapshot.forEach(function(childSnapshot) {
                      var key = childSnapshot.key;
                      var childData = childSnapshot.val();
                      var newpassword = $('#newpassword').val();
                      if (key == user_id) {
                        firebase.database().ref('users/'+key).update({
                          password: newpassword
                        });
                          myApp.alert('Password Updated Successfully', 'Change Password');
                                     
                      }
                  });
                });

            }
          }
        ]
      });
}

// Start new code for back button
document.addEventListener('deviceready', function() {
    var exitApp = false, intval = setInterval(function (){exitApp = false;}, 1000);
    document.addEventListener("backbutton", function (e){
        e.preventDefault();
        if (exitApp) {
            clearInterval(intval) 
            navigator.notification.confirm("Are you sure you want to exit ?", onConfirm, "Confirmation", "Yes,No"); 
        }
        else {
            exitApp = true;
            history.back(1);
        } 
    }, false);
}, false);



function printme()
{ 

  $("#printme").print({
      addGlobalStyles : true,
      stylesheet : null,
      rejectWindow : true,
      noPrintSelector : ".no-print",
      iframe : true,
      append : null,
      prepend : null
  });

  
}

function showloader()
{
   myApp.showPreloader();
    setTimeout(function () {
        myApp.hidePreloader();
    }, 1000);
}



myApp.onPageInit('index', function() {
  showloader();
  $$('.hideonlogin').hide();
  $$('.navbar').hide();
}).trigger();

function logout()
{
    showloader();
      firebase.auth().signOut().then(function() {
         mainView.router.loadPage({url:'login-screen-page.html', ignoreCache:true, reload:true })
      }, function(error) {
          myApp.alert('Sign Out Failed', function () {
            mainView.goBack();
          });
      });
}

$$('.signout').on('click', function () {
    showloader();
      firebase.auth().signOut().then(function() {
         mainView.router.loadPage({url:'login-screen-page.html', ignoreCache:true, reload:true })
      }, function(error) {
          myApp.alert('Sign Out Failed', function () {
            mainView.goBack();
          });
      });
});



myApp.onPageInit('login-screen', function (page) {
  var pageContainer = $$(page.container);
  $$('.hideonlogin').hide();
  $$('.navbar').hide();

    pageContainer.find('.login-button').on('click', function () {
        myApp.showPreloader();
        setTimeout(function () {
            myApp.hidePreloader();
        }, 4000);

        var username = pageContainer.find('input[name="username"]').val();
        var password = pageContainer.find('input[name="password"]').val();

         function loginuserExistsCallback(username, exists) {
            if (exists) {
                mainView.router.loadPage({url:'account.html', ignoreCache:true, reload:true })
                return true;
            }
            else {
               
                  myApp.alert('Error Username or Password is Not Correct!', function () {
                      mainView.goBack();
                  });
             }
          } 


        var role = pageContainer.find('#role').val();
        var ref = firebase.database().ref("users");
        ref.orderByChild('username').equalTo(username)
            .once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    if (childData.username == username && childData.password == password) {
                       $$('.statusbar-overlay').attr('data-userid', key);
                       $$('.image').val(childData.image);
                       $$('.fullname').val(childData.fullname);
                       $$('.loginrole').val(childData.role);
                       
                        if (childData.role == 'teacher') {
                          $$('.addsubject').html('<a href="addsubject.html" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title">  <div class="item-title"> Add Subject</div> </div> </div></a>');
                        }
                    }
                });
             var exists = (snapshot.val() !== null);
             loginuserExistsCallback(username, exists);
        });
  });
});

myApp.onPageInit('register-screen', function (page) {
  var pageContainer = $$(page.container);
  $$('.hideonlogin').hide();
  $$('.navbar').hide();

      pageContainer.find('.register-button').on('click', function () {
        var fullname = pageContainer.find('input[name="fullname"]').val();
        var username = pageContainer.find('input[name="username"]').val();
        var password = pageContainer.find('input[name="password"]').val();
        var image = pageContainer.find('input[name="image"]').val();
        var email = pageContainer.find('input[name="email"]').val();
        var age = pageContainer.find('input[name="age"]').val();
        var contact = pageContainer.find('input[name="contact"]').val();

        var file_data = $$('#sortpicture').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        
        console.log(form_data);
        function userExistsCallback(username, exists) {
            if (exists) {
               myApp.alert('Error Registration Username Already Exist!', function () {
                mainView.goBack();
              });
            }
            else {
              $$.post('http://amadavaothesisrecords.com/upload.php', form_data , function (data) {
            
                      var db = firebase.database();
                        var ref = db.ref("users");
                        var newUser = ref.push();
                        newUser.set({
                          fullname: fullname,
                          username: username,
                              role: role,
                          password: password,
                          image   : data,
                          email :email,
                          age : age,
                          contact: contact
                        });

                      if (role == "student") {
                          myApp.alert('Student Successfully registered!', function () {
                                mainView.router.loadPage({url:'login-screen-page.html', ignoreCache:true, reload:true })
                                return true;
                          });
                      }else if (role == "teacher") {
                          myApp.alert('Teacher Successfully registered!', function () {
                                mainView.router.loadPage({url:'login-screen-page.html', ignoreCache:true, reload:true })
                                return true;
                          });
                      }  

                      
              });
            }
       }


          var role = pageContainer.find('#role').val();
          var ref = firebase.database().ref("users");
          ref.orderByChild('username').equalTo(username)
              .once('value').then(function(snapshot) {
               var exists = (snapshot.val() !== null);
               userExistsCallback(username, exists);
          });



      });
});




$$(document).on('pageInit',function(e){
    var page = e.detail.page;

    if (page.name === 'addsubject') {
          var pageContainer = $$(page.container);
          var user_id = $$('.statusbar-overlay').data('userid');

          pageContainer.find('.addsubject-button').on('click', function () {
          var subjectname = pageContainer.find('input[name="subjectname"]').val();
          var subjectcode = pageContainer.find('input[name="subjectcode"]').val();
          var description = pageContainer.find('input[name="description"]').val();
          var haslab = pageContainer.find('input[name="haslab"]').val();


          var subjectschedule = pageContainer.find('input[name="subjectschedule"]').val();

           function userExistsCallback(subjectcode, exists) {
              if (exists) {
                     myApp.alert('Error Add Subject , Already Exist!', function () {
                      mainView.goBack();
                    });
              } else {

                      var db = firebase.database();
                      var ref = db.ref("subjects");
                      var newSubject = ref.push();
                      newSubject.set({
                        subjectcode: subjectcode,
                        subjectname: subjectname,
                        description: description,
                        teacher_id    : user_id,
                        subjectschedule : subjectschedule,
                        haslab : haslab
                      });

                    myApp.alert('Subject Added!', function () {
                         mainView.goBack();
                    });
              }
            }

            var ref = firebase.database().ref("subjects");
            ref.orderByChild('subjectcode').equalTo(subjectcode)
                .once('value').then(function(snapshot) {
                 var exists = (snapshot.val() !== null);
                 userExistsCallback(subjectcode, exists);
            });



        });
     }

   
   if (page.name === 'account') {
      $$('.hideonlogin').show();
      $$('.navbar').show();
      var user_id = $$('.statusbar-overlay').data('userid');
      var loginrole = $$('.loginrole').val();


      if(loginrole == 'admin')
        {
          $$('.sidenavwrapper').html('<li><a href="teachers.html" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title">  <div class="item-title"> Teachers</div> </div> </div></a></li><li><a href="students.html" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title">  <div class="item-title"> Students</div> </div> </div></a></li>     <li><a href="account.html" class="item-link close-panel"><div class="item-content"><div class="item-inner"><div class="item-title">  <div class="item-title"> My Account</div></div></div></a></li><li><a href="#" class=" close-panel" onClick="logout()"> <div class="item-content"> <div class="item-inner"><div class="item-title">  <div class="item-title"> Sign Out</div></div></div></a></li>');
        }

      var query = firebase.database().ref("users").orderByKey();
        query.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (key == user_id) {
                var fullname = childData.fullname;
                // $$('.username').html(childData.username);
                // $$('.fullname').html(childData.fullname);
                // $$('.fullname').val(childData.fullname);
                $$('.role').html(childData.role);
                // $$('.email').html(childData.email);
                // $$('.usercontact').html(childData.contact);
                // $$('.age').html(childData.age);
                $$(".fullnamebg").css("background-image", 'url(http://amadavaothesisrecords.com/uploads_teachers/'+childData.image+')');
                
                var username =  childData.username;
                var fullname =  childData.fullname;
                var role     =  childData.role;
                var email    =  childData.email;
                var contact  =  childData.contact;
                var age      =  childData.age;

                $$('.username').html(' <div class="item-input"><input value="'+username+'" type="text" id="username" name="username" readonly> </div>');

                $$('.fullname').html(' <div class="item-input"><input value="'+fullname+'" type="text" id="fullname"  name="fullname"> </div>');

                // $$('.role').html(' <div class="item-input"><input value="'+role+'" type="text" name="role"> </div>');

                $$('.email').html(' <div class="item-input"><input value="'+email+'" type="text" id="email"  name="email"> </div>');

                $$('.usercontact').html(' <div class="item-input"><input value="'+contact+'" type="text" id="usercontact"  name="contact"> </div>');

                $$('.age').html(' <div class="item-input"><input value="'+age+'" type="text" id="age"  name="age"> </div>');
            

              $$('#username').on('keyup', function (e) { 
                    
                      var user_id = $$('.statusbar-overlay').data('userid');

                        var ref = firebase.database().ref("users"); //root reference to your data
                        ref.orderByKey().equalTo(user_id)
                         .once('value').then(function(snapshot) {
                             snapshot.forEach(function(childSnapshot) {
                              var key = childSnapshot.key;
                              var childData = childSnapshot.val();
                                  if (key == user_id) {
                                    var username =  $$('#username').val();
                                    firebase.database().ref('users/'+key).update({
                                          username: username
                                    });
                                     myApp.alert('Username Updated Successfully', 'Edit Account');

                                  }
                            });
                        });
              });


              //   $$('#password').on('keyup', function (e) { 
                    
              //         var user_id = $$('.statusbar-overlay').data('userid');

              //           var ref = firebase.database().ref("users"); //root reference to your data
              //           ref.orderByKey().equalTo(user_id)
              //            .once('value').then(function(snapshot) {
              //                snapshot.forEach(function(childSnapshot) {
              //                 var key = childSnapshot.key;
              //                 var childData = childSnapshot.val();
              //                     if (key == user_id) {
              //                       var password =  $$('#password').val();
              //                       firebase.database().ref('users/'+key).update({
              //                             password: password
              //                       });
              //                        myApp.alert('Email Updated Successfully', 'Edit Account');

              //                     }
              //               });
              //           });
              // });


              $$('#age').on('keyup', function (e) { 
                    
                      var user_id = $$('.statusbar-overlay').data('userid');

                        var ref = firebase.database().ref("users"); //root reference to your data
                        ref.orderByKey().equalTo(user_id)
                         .once('value').then(function(snapshot) {
                             snapshot.forEach(function(childSnapshot) {
                              var key = childSnapshot.key;
                              var childData = childSnapshot.val();
                                  if (key == user_id) {
                                    var age =  $$('#age').val();
                                    firebase.database().ref('users/'+key).update({
                                          age: age
                                    });
                                     myApp.alert('Age Updated Successfully', 'Edit Account');

                                  }
                            });
                        });
              });

              // $$('#fullname').on('keyup', function (e) { 
                    
              //         var user_id = $$('.statusbar-overlay').data('userid');
              //           var ref = firebase.database().ref("users"); //root reference to your data
              //           ref.orderByKey().equalTo(user_id)
              //            .once('value').then(function(snapshot) {
              //                snapshot.forEach(function(childSnapshot) {
              //                 var key = childSnapshot.key;
              //                 var childData = childSnapshot.val();
              //                     if (key == user_id) {
              //                       var fullname =  $$('#fullname').val();
              //                        myApp.alert('Full name Updated Successfully', 'Edit Account');

              //                       firebase.database().ref('users/'+key).update({
              //                             fullname: fullname
              //                       });
              //                     }
              //               });
              //           });
              // });


              $$('#email').on('keyup', function (e) { 
                    
                      var user_id = $$('.statusbar-overlay').data('userid');
                      
                        var ref = firebase.database().ref("users"); //root reference to your data
                        ref.orderByKey().equalTo(user_id)
                         .once('value').then(function(snapshot) {
                             snapshot.forEach(function(childSnapshot) {
                              var key = childSnapshot.key;
                              var childData = childSnapshot.val();
                                  if (key == user_id) {
                                    var email =  $$('#email').val();
                                    firebase.database().ref('users/'+key).update({
                                          email: email
                                    });
                                     myApp.alert('Email Updated Successfully', 'Edit Account');
                                  }
                            });
                        });
              });


                 $$('#usercontact').on('keyup', function (e) { 
                    
                      var user_id = $$('.statusbar-overlay').data('userid');
                      
                        var ref = firebase.database().ref("users"); //root reference to your data
                        ref.orderByKey().equalTo(user_id)
                         .once('value').then(function(snapshot) {
                             snapshot.forEach(function(childSnapshot) {
                              var key = childSnapshot.key;
                              var childData = childSnapshot.val();
                                  if (key == user_id) {
                                    var contact =  $$('#usercontact').val();
                                    firebase.database().ref('users/'+key).update({
                                          contact: contact
                                    });
                                     myApp.alert('Contact Updated Successfully', 'Edit Account');

                                  }
                            });
                        });
              });



              }
          });
        });

          mainView.router.loadPage({url:'account.html', ignoreCache:true, reload:true })
          return true;
    }



    

})