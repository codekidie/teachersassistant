
function getposts()
{

 var query = firebase.database().ref("posts").orderByKey();
    query.once("value")
      .then(function(snapshot) {
        var  postdata = ''; 
        snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          var img = childData.post_file; 
          var storage = firebase.storage();
          var storageRef = storage.ref();
          var postRef = storageRef.child('posts/'+img);
          postRef.getDownloadURL().then(function(url) {
            if (childData.subject_name == $('.subject-name').val()) {
                       postdata+= '<div class="card facebook-card">';
                       postdata+= '   <div class="card-header">';
                       postdata+= '      <div class="facebook-avatar"><img src="http://amadavaothesisrecords.com/uploads_teachers/'+childData.user_image+'" width="34" height="34"></div>';
                       postdata+= '       <div class="facebook-name">'+childData.fullname+'</div>';
                       postdata+= '       <div class="facebook-date">'+childData.date+'</div>';
                       postdata+= '   </div>';
                       postdata+= '   <div class="card-content">';
                       postdata+= '   <div class="card-content-inner">';
                       postdata+= '   <a href="#" onclick="delete_post(\''+img+'\')" style="float: right;clear: both;">Delete Post</a>';

                       postdata+= '   <p>'+childData.comment_text+'</p>';

                       if (childData.file_type == "image/jpeg" || childData.file_type == "image/png") {
                            postdata+= '<img src="'+url+'" width="100%">';
                       }else{
                          postdata+= '<a href="#" onclick="window.open(\''+url+'\',\'_system\');">Download Attachment</a>';
                       }
                       postdata+= '   <p class="color-gray">Likes: <span id="likes_'+key+'"></span> &nbsp;&nbsp; Comments:  <span id="comments_'+key+'"></span></p>';
                       postdata+= '   </div>';
                       postdata+= '   </div>';
                       postdata+= '   <div class="card-footer"><a href="#" class="link" onclick="clickLike(\''+key+'\')">Like</a><a href="#" class="link" onclick="getcomments(\''+key+'\',\''+childData.comment_text+'\',\''+childData.fullname+'\',\''+childData.subject_name+'\',\''+childData.user_image+'\')">Comment</a></div>';
                      postdata+= '</div>';
                      $('#populate_post_data').html(postdata);
                      getLikes(key);
                      getComments(key);
            }
          }).catch(function(error) {

          });

      });
    });
}




function submitPost()
{
         var file = $('#file_name').prop('files')[0];
          var uploader = $('#uploader');
          var comment_text       = $('#comment_text').val();
         
          uploader.show();
          var uuid = guid();
          var storageRef = firebase.storage().ref('posts/'+uuid);
          var task = storageRef.put(file);


         var filedata = $('#file_name').prop('files');
         var file_type = filedata[0].type;
         
         //image/jpeg
          task.on('state_changed',

              function progress(snapshot){
                    var   percentage = (snapshot.bytesTransferred /  snapshot.totalBytes) * 100;
                        uploader.show();
                        uploader.css({'width': percentage+"%"});
                          console.log(percentage+"%");
                      },

                      function error(err){

                      },
                      
                      function complete(){
                          var date = new Date();
                          currentDate = date.getDate();     // Get current date
                          month       = date.getMonth() + 1; // current month
                          year        = date.getFullYear();
                          hour = date.getHours();
                          min  = date.getMinutes();
                          sec  = date.getSeconds();
                          var datetime = month+"/"+hour+":"+min +":"+sec;

                          var db = firebase.database();
                          var ref = db.ref("posts");
                          var newPost = ref.push();
                          var comment_text  = $('#comment_text').val();
                          var user_id = $('.statusbar-overlay').data('userid');
                          newPost.set({
                            post_file      : uuid,
                            comment_text   : comment_text,
                            file_type      : file_type,
                            user_image     : $('.image').val(),
                            date           : datetime,
                            subject_name   : $('.subject-name').val(),
                            user_id        : user_id,
                            fullname       : $('.fullname').val()
                          });

                          uploader.hide();

                          var myApp = new Framework7(); 
                          var mainView = myApp.addView('.view-main');
                           
                          var $$ = Dom7;
                          myApp.addNotification({
                              title    : 'Teacher Assistant',
                              message  : 'Success : Post uploaded to the server!',
                              hold     : 3000,
                              button   : {
                                text   : 'Close',
                                color  : 'red'
                              }
                          });

                          myApp.closeModal(); 
                          getposts();
                      }

                  );     
}

function addNewPost()
{
    var subject = $$('.subject-data').val();
    var user_id = $$('.statusbar-overlay').data('userid');
    var content = '<div class="progressbar" id="uploader" data-progress="0"><span></span></div>';
      content += '<form id="my-form" class="list-block">';
       content += '<ul>';
        content += '<li>';
        content += '<div class="item-content">';
        content += '<input type="file" id="file_name">'; 
        content += '</div>';   
        content += '</li>';
         content += '<li>';
           content += '<div class="item-content">';
              content += '  <textarea id="comment_text" class="resizable" style="height:120px !important" placeholder="Say Something..."></textarea>';
         content += '</div></li>';

         content += '<li>';
           content += '<div class="item-content">';
              content += '<span onclick="submitPost()"  style="color: #fff;background: #2196f3;padding: 5px;border-radius: 5px;" class="button-fill color-blue button-round"> Submit</span>';
         content += '</div></li>';
      content += ' </ul>';
    content += ' </form>';

    myApp.modal({
      title:  "Add New Post",
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

$$(document).on('pageInit',function(e){
  var page = e.detail.page;
  if (page.name === 'posts') {
     $$('.hideonlogin').show();
     $$('.navbar').show();
     myApp.hidePreloader();
     var user_id = $$('.statusbar-overlay').data('userid');
     getposts();
   
   }
});   