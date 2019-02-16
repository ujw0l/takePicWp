<?php
/*

Plugin Name: Take Pic
Plugin URI:
Description: WordPress plugin which enables user to take picture with their webcam apply effects and upload to the server
Version: 1.1.3
Author: Ujwol Bastakoti
Author URI:https://ujwolbastakoti.wordpress.com/
License: GPLv2

*/



class takePicWidget extends WP_Widget{
		public function __construct() {
			parent::__construct(
					'takePic', // Base ID
					'Take Pic', // Name
					array( 'description' => __( 'This plugin which enables user to take picture with their webcam and upload them', 'text_domain' ), ) // Args
			);
			
			add_action( 'wp_enqueue_scripts', array($this, 'load_dashicons_front_end') );

			//hook to  register widget
			add_action( 'widgets_init', array($this,'register_takePicWidget') );
			
			
		}

		//load dashicon
		public function load_dashicons_front_end() {
		    wp_enqueue_style( 'dashicons' );
		}



		public function form( $instance ) {

		    if ( isset( $instance[ 'title' ] ) ) {
					$title = $instance[ 'title' ];

		    }
		    else{
					$title = __( 'Take Pic', 'text_domain' );
		    }

				?>
      <p>
				<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label> 
				<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
				</p>

<?php
		}


		/**
		 * Sanitize widget form values as they are saved.
		 *
		 * @see WP_Widget::update()
		 *
		 * @param array $new_instance Values just sent to be saved.
		 * @param array $old_instance Previously saved values from database.
		 *
		 * @return array Updated safe values to be saved.
		 */
		public function update( $new_instance, $old_instance ) {
		    
		    $instance = array();
		    $instance['title'] = strip_tags( $new_instance['title'] );
			return $instance;
		}


		/**
		 * Front-end display of widget.
		 *
		 * @see WP_Widget::widget()
		 *
		 * @param array $args     Widget arguments.
		 * @param array $instance Saved values from database.
		 */
		public function widget( $args, $instance ) {
		wp_enqueue_style( 'vanillaCtcOverlayCss', plugins_url('css/ctc_overlay_style.css',__FILE__ )); //register css;
		wp_enqueue_style( 'takePicCss', plugins_url('css/take-pic.css',__FILE__ )); //register css;
       
        
        wp_enqueue_script('ctcOverlayJs', plugins_url('js/ctc_overlay.js',__FILE__ ));
        wp_enqueue_script('takePicJs', plugins_url('js/take-pic.js',__FILE__ ));
        wp_localize_script( 'takePicJs', 'my_ajax_url', admin_url( 'admin-ajax.php' ) );
        

			extract( $args );
			
			$title = apply_filters( 'widget_title', $instance['title'] );

			echo $before_widget;
			if ( ! empty( $title ) )
				echo $before_title . $title . $after_title;
			?>
              <div id="takePicWidget">
              <?php if(is_user_logged_in()):?>
              		<a id="takePicButton" href="JavaScript:void(0);" title="Take picture with camera and upload" onclick="new takePic();"> </a>
              		
              		<a id="viewUploadedImages" href="JavaScript:void(0);" title="View all uploaded images" onclick="takePic.viewUploadedImages();"> </a>
              		<?php else:?>
              			<a id="takePicButton" class="takePicIconNotLogged" href="JavaScript:void(0);" title="Take picture with camera and upload" onclick="new takePic();"> </a>
              		<?php endif;?>
              </div>

		<?php

			echo $after_widget;
		}


		
		//function to register takePic widget
		public function register_takePicWidget(){
		    register_widget( "takePicWidget" );
		}
		
			
   
}


/*
 * class to handle other plugin functionlities
 * 
 * */


class takePicPlugin{
    
    
    public function __construct(){
        
       
        self::allRequiredWpActions();
        self::allRequiredAjaxAction();
        
    }
    
    //function to register required wp action
    public function allRequiredWpActions(){
        
        add_action('admin_menu', array($this, 'takePicAdminMenu'));
        add_action('admin_footer', array($this,'takePicRemoveUpload_javascript'));
        
    }
    
    //function to register required ajax function
    public function allRequiredAjaxAction(){
        
        add_action('wp_ajax_ajaxUploadImage', array($this ,'ajaxUploadImage'));
        add_action('wp_ajax_nopriv_ajaxUploadImage', array($this ,'ajaxUploadImage'));
        
        add_action('wp_ajax_ajaxUpdateProfilePic', array($this ,'ajaxUpdateProfilePic'));
        add_action('wp_ajax_nopriv_ajaxUpdateProfilePic', array($this ,'ajaxUpdateProfilePic'));
        
        add_action('wp_ajax_ajaxGetUploadedImages', array($this ,'ajaxGetUploadedImages'));
        add_action('wp_ajax_nopriv_ajaxGetUploadedImages', array($this ,'ajaxGetUploadedImages'));
        
        add_action('wp_ajax_ajaxDeleteImage', array($this ,'ajaxDeleteImage'));
        add_action('wp_ajax_nopriv_ajaxDeleteImage', array($this ,'ajaxDeleteImage'));
        
        add_action('wp_ajax_takePicAdminRemoveUploadAjax',array($this,'takePicAdminRemoveUploadAjax'));
        
        
        
    }
     
    public function takePicAdminMenu(){
        
        
        if ( is_admin()):

        add_menu_page( 'Take Pic',
            'Take Pic' ,
            'administrator',
            'takePicAdminPanel',
             array($this, 'takePicAdminHtml'),
            'dashicons-video-alt2',
            '10');
 
            endif;
        
    }
    
    public function takePicAdminHtml(){
       
        ?>
        
        <div class="takePicAdminPanel">

        			<h1 class="dashicons-before dashicons-video-alt2">Take Pic</h1>
        			<p><b>Users with Image uploads and size</b></p>
        			
        		<ul>
        		
        		<?php 
        		     array_map(function($userObj){
        		         $user = get_user_by('login', $userObj->user_login);
        		         
        		       
        		       
        		         if( !empty($user->first_name) && !empty($user->last_name)){
        		             $name = $user->first_name." ".$user->last_name;  
        		         }else{
        		             
        		             $name = $userObj->user_login;
        		         }
        		       
        		         
        		         $uploadDir = wp_upload_dir();
        		         $userDirname = $uploadDir['basedir']. '/' . $userObj->user_login;
        		              
        		         if(file_exists($userDirname)):    
        		              
        			     ?>
        			     <div id="takePicUpload-<?=$userObj->user_login?>" class='plugin-notice notice notice-info notice-alt'  
        			     onMouseOver="this.style.boxShadow='2px 2px 3px lightblue'"
   						onMouseOut="this.style.boxShadow=''" style='width:40%;height:30px;padding-top:10px;' >
        			     <span><b><?=$name.'<i> ('.$userObj->user_login.')</i>'?> :- <i> Upload size : <?=floor(filesize($userDirname))/1000?> mb</i></b><span>
        			    
        			     <span style="float:right; margin-right:1%">
        			     	<a title="Delete images uploaded by user"
        			     	   data-user-login="<?=$userObj->user_login?>"  
        			     	   onclick= 'takePicRemoveUpload(this.getAttribute("data-user-login"));' 
        			     	   class="dashicons-before dashicons-trash takePicDeleteUpload" 
        			     	   style="text-decoration:none;" 
        			     	   href="JavaScrip:void(0);"
        			     	   
        			     	   ></a></span>
        			     </div>
        			<?php
        			
        			endif;
        	},get_users( array( 'fields' => array( 'user_login' ) ) ));
        		
        			?>
        		
        		</ul>	
        			
             

        </div>
        <?php
        
    }
    
    //function to remove user upload with javscript
    public function takePicRemoveUpload_javascript(){
     ?>
     <script type="text/javascript">

		function takePicRemoveUpload(userLogin){

			if(confirm("Are you sure you want delete all uploads by the the user?")){	
			
				var xhttp =  new XMLHttpRequest();
				xhttp.open("POST",ajaxurl, true);
				xhttp.responseType = "text";
				xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
				
				xhttp.onload = function () {
			        if (this.status >= 200 && this.status < 400) {
			        	
			        	
			        	if(this.response === 'deleted'){
			        		
			        		alert("Uploads sucessfully deleted");

			        		var rowDelete = document.getElementById("takePicUpload-"+userLogin);

			        		rowDelete.parentNode.removeChild(rowDelete);
			
			        	}
			        	else{

			        		alert("Uploads couldn't be deleted. \nProbably, file permission issue, consult with your network adminstrator ");
			        	}
			            
			        } else {
			        	
			            alert(this.response);
			        }
			    };
			    
			    xhttp.onerror = function() {
			    	
			        alert("connection error");
			    };
						
				xhttp.send("action=takePicAdminRemoveUploadAjax&userlogin="+userLogin);

			}
		}


     </script>
     
      
     <?php    
    }
    
    //ajax function function tp handle remove request 
    public function takePicAdminRemoveUploadAjax(){
       
        $uploadDir = wp_upload_dir();
        $userDir = $uploadDir['basedir'].'/'. $_POST['userlogin'];
        $old = umask(0);
        chmod($uploadDir['basedir'], 0777);
        umask($old);
        
        if(rmdir($userDir)):
            
            echo "deleted";
        else:
        
            echo "not deleted";
        
        endif;
 
        wp_die();
        
    }
    
  /*
   * 
   * frontend coding
   * 
   */  
    
  public function ajaxUploadImage(){
          
    if(is_user_logged_in()):
    $current_user = wp_get_current_user();
       $uploadDir = wp_upload_dir();
       $userDirname = $uploadDir['basedir']. '/' . $current_user->user_login;
       
           if(!file_exists($userDirname)):
           
                      if(wp_mkdir_p($userDirname)):
                           if($this->base64ToPngSave($_POST['image'],$userDirname)):
                                echo "Image sucessfully uploaded";
                           else:
                              echo "Image couldn't be uploaded at this time";
                           endif;
                         else:
                             echo "Image couldn't be uploaded at this time";
                         endif;
           else:
              
                   if($this->base64ToPngSave($_POST['image'],$userDirname)):
                        echo "Image sucessfully uploaded";
                   else:
                   
                   var_dump($this->base64ToPngSave($_POST['image'],$userDirname));
                        echo "Couldn't upload image, try again later";
                   endif;
              
           endif;
      
      else:
      
            echo "You need to login to upload image";
      endif;
      
        wp_die();
       
    }
    
    
    private function base64ToPngSave( $base64String,$directory){

        $outPutFile = $directory.'/'.time().'.png';  
       
        if(strpos($base64String,'data:image/png;base64,') === 0): 
            if(file_put_contents($outPutFile, base64_decode(str_replace(' ', '+',str_replace('data:image/png;base64,', '',$base64String))))):
            
                return true;
            else:
                   return false;
            endif;
         endif;   
       
    }
    
  
    
    
    //function to delete image
    public function ajaxDeleteImage(){
    
        $uploadDir = wp_upload_dir();
      
        if(unlink($uploadDir['basedir'].str_replace(content_url().'/uploads', '', $_POST['image']))):
        
         echo "deleted";   
        
        else:
   
            echo "delete fail";
        
        endif;

        wp_die();
    }
    
    
    //function to get all uploaded 
    public function ajaxGetUploadedImages(){
        $current_user = wp_get_current_user();
        $uploadDir = wp_upload_dir();
        $userDirname = $uploadDir['basedir']. '/' . $current_user->user_login;
        
        
        if(file_exists($userDirname)):
            $imageArray = scandir($userDirname);
              if(count($imageArray)>2): 
              echo json_encode(array('dir'=>content_url().'/uploads/'.$current_user->user_login,'images'=>$imageArray));
                else:
                     echo json_encode(array("noImage"));
                endif;
             else:
                echo json_encode(array("noImage"));
             endif;
        wp_die();
    }
    
}


new takePicPlugin();
new takePicWidget();
