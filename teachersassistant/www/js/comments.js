 function  likeExistsCallback(subject, user_id,postkey, exists)
  {
    if (exists) {
      // Edit chairs
          var ref = firebase.database().ref("likecomment"); //root reference to your data
          ref.orderByChild('post_id').equalTo(postkey)
           .once('value').then(function(snapshot) {
               snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.subjectid == subject && childData.like == 1 && childData.user_id == user_id) {
                  firebase.database().ref('likecomment/'+key).set({
                      post_id   : postkey,
                      subjectid : subject,
                      user_id   : user_id,
                      like      : 0
                  });
                getposts();
                }else if(childData.subjectid == subject && childData.like == 0 && childData.user_id == user_id){
                  firebase.database().ref('likecomment/'+key).set({
                      post_id   : postkey,
                      subjectid : subject,
                      user_id   : user_id,
                      like      : 1
                  });
                getposts();
                  
                }
            });
          });
    }
    else {

          var db = firebase.database();
          var ref = db.ref("likecomment");
          var  likeDB= ref.push();
          likeDB.set({
              post_id   : postkey,
              subjectid : subject,
              user_id   : user_id,
              like      : 1
          });
                getposts();
           
    }
}


function clickLike(postkey)
{
   var subject = $('.subject-data').val();
   var user_id = $('.statusbar-overlay').data('userid');
    var ref = firebase.database().ref("likecomment");
    ref.orderByChild('post_id').equalTo(postkey)
        .once('value').then(function(snapshot) {
         var exists = (snapshot.val() !== null);         
         likeExistsCallback(subject, user_id,postkey, exists);
    });
}

function getLikes(postkey)
{
   var subject = $('.subject-data').val();
   var user_id = $('.statusbar-overlay').data('userid');
   var ref = firebase.database().ref("likecomment"); //root reference to your data
    ref.orderByChild('post_id').equalTo(postkey)
     .once('value').then(function(snapshot) {
        var counter = 0;
         snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childData.like == 1) {
            counter++;
          }
          $('#likes_'+childData.post_id).text(counter);
      });
    });
}


function getComments(postkey)
{
   var subject = $('.subject-data').val();
   var user_id = $('.statusbar-overlay').data('userid');
   var ref = firebase.database().ref("comments"); //root reference to your data
    ref.orderByChild('post_id').equalTo(postkey)
     .once('value').then(function(snapshot) {
        var counter = 0;
         snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
            counter++;
          $('#comments_'+childData.post_id).text(counter);
      });
    });
}

function getcomments(postkey,comment_text,fullname,subject_name,user_image)
{
         getCommentsReply(postkey);
          var subject = $('.subject-data').val();
          var user_id = $('.statusbar-overlay').data('userid');
          var content = '';
          content += '<a href="#" style="float:right" class="item-link" onclick="closeModal()">Close</a><br style="clear: both;"><div class="card">';
          content += '<div class="card-content">';
           content += ' <div class="list-block media-list">';
             content += ' <ul>';
               content += ' <li class="item-content">';
                 content += '  <div class="item-media">';
                 content += '    <img src="http://amadavaothesisrecords.com/uploads_teachers/'+user_image+'" width="34" height="34">';
                 content += '   </div>';
                 content += '  <div class="item-inner">';
                 content += '     <div class="item-title-row">';
                 content += '       <div class="item-title">'+comment_text+'</div>';
                 content += '     </div>';
                 content += '    </div>';
                 content += ' </li>';
               content += ' </ul>';
             content += ' </div>';
          content += '  </div>';
          content += ' </div>  ';
          content += ' <div id="reply_comment_data" style="height: 250px;overflow: scroll;"></div>  ';
              

          content += ' <div class="card-footer" style="padding:0px !important;">';
              content += '  <textarea id="replycomment_text" class="resizable" style="height: 40px !important;width: 100%;border: 0px;" placeholder="Say Something..."></textarea><button style="height: 50px;background: salmon;color: #fff;border: 0px;" onclick="sendcomment(\''+postkey+'\')">Send</button>';

        content += '  </div>';
        content += ' </div>  ';

        myApp.modal({
          title:  "Add New Comment",
          text: content,
          buttons: [
            {
              text: 'Close',
              onClick: function() {
               mainView.router.loadPage({url:'posts.html', ignoreCache:true, reload:true })
              }
            }
          ]
        });          
}


function closeModal()
{
  myApp.closeModal();
}

function getCommentsReply(postkey)
{
          var ref = firebase.database().ref("comments"); //root reference to your data
          ref.orderByChild('post_id').equalTo(postkey)
           .once('value').then(function(snapshot) {
            var content = '';
                content += '<div class="card">';
                  content += '<div class="card-content">';
                    content += ' <div class="list-block media-list">';
                     snapshot.forEach(function(childSnapshot) {
                      var key = childSnapshot.key;
                      var childData = childSnapshot.val();
                           content += ' <ul>';
                           content += ' <li class="item-content">';
                           content += '  <div class="item-media">';
                           content += '     <img src="http://amadavaothesisrecords.com/uploads_teachers/'+childData.user_image+'" width="34" height="34">';
                           content += '   </div>';
                           content += '  <div class="item-inner">';
                           content += '     <div class="item-title-row">';
                           content += '       <div class="item-title">'+childData.comment+'</div>';
                           content += '     </div>';
                           content += '    </div>';
                           content += ' </li>';
                         content += ' </ul>';
                 
            });
                  content += ' </div>';
                  content += ' </div>';
                  content += '  </div>';
                $('#reply_comment_data').html(content);
          });


}


function sendcomment(postkey)
{
      var comment = $('#replycomment_text').val();
      var user_id = $('.statusbar-overlay').data('userid');

      var db = firebase.database();
      var ref = db.ref("comments");
      var newComment = ref.push();

      var d = new Date(); 
      var datetime = d.toDateString();

      newComment.set({
        comment        : comment,
        post_id        : postkey,
        user_id        : user_id,
        user_image     : $('.image').val(),
        date           : datetime,
        subject_name   : $('.subject-name').val(),
        fullname       : $('.fullname').val()
      });

      getCommentsReply(postkey);
}