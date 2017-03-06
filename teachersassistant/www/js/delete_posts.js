
function delete_post(post_file)
{

 var query = firebase.database().ref("posts").orderByKey();
    query.once("value")
      .then(function(snapshot) {

        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          post_img = childData.post_file;
          if (post_img == post_file) {
                var storage = firebase.storage();
                var storageRef = storage.ref();
                var desertRef = storageRef.child('posts/'+post_file);
                // Delete the file
                desertRef.delete().then(function() {
                      firebase.database().ref("posts").child(key).remove().then(function() {
                          myApp.alert('Post Deleted Success!', function () {
                              mainView.router.loadPage({url:'posts.html', ignoreCache:true, reload:true })
                              return true;
                          });

                      });
                }).catch(function(error) {
                  // Uh-oh, an error occurred!
                   console.log(error);

                });
          }
      });
    });
}

