$$(document).on('pageInit',function(e){
    var page = e.detail.page;



    if (page.name === 'profile') {
      $$('.hideonlogin').show();
      $$('.navbar').show();
      var profile_id = $$('.profile_id').val();
      myApp.closeModal();
      myApp.hidePreloader();
      var query = firebase.database().ref("users").orderByKey();
        query.once("value")
          .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (key == profile_id) {
                var fullname = childData.fullname;
                $$('.username').html(childData.username);
                $$('.fullname').html(childData.fullname);
                $$('.role').html(childData.role);
                $$('.email').html(childData.email);
                $$('.usercontact').html(childData.contact);
                $$('.age').html(childData.age);
                $$(".fullnamebg").css("background-image", 'url(http://amadavaothesisrecords.com/uploads_teachers/'+childData.image+')');
              }
          });
        });

        

          mainView.router.loadPage({url:'profile.html', ignoreCache:true, reload:true })
          return true;
    }
    

})
