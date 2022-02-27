<?php
/*
Plugin Name: Take Pic
Plugin URI: https://github.com/ujw0l/takePicWp
Description: WordPress plugin which enables user to take picture with their webcam apply effects and upload to the server
Version: 3.0.0
Author: Ujwol Bastakoti
text-domain : take-pic
Author URI:http://ujw0l.github.io/
License: GPLv2
*/








/** 
 * class to handle other plugin functionlities
 */

class takePicPlugin{
    
    
    public function __construct(){
        
        self::allRequiredWpActions();
        self::allRequiredAjaxAction();
        
    }
    


    /**
     * function to register required wp action
     */
    public function allRequiredWpActions(){
        
        add_action( 'wp_enqueue_scripts', array($this,'enequeFrontendJs' ));
        add_action('wp_enqueue_scripts',array($this,'loadFrontEndStyle'));
        add_action('admin_menu', array($this, 'takePicAdminMenu'));
        add_action('admin_footer', array($this,'takePicRemoveUpload_javascript'));
        add_action( 'admin_enqueue_scripts', array($this,'enequeAdminJs' ));
        add_action('init', array($this,'takePicRegisterBlock'));
    }
    

    /**
     * Function to load dashicons
     */

     public function loadFrontEndStyle(){
        wp_enqueue_style( 'dashicons' );
        wp_enqueue_style( 'vanillaCtcOverlayCss', plugins_url('css/ctc_overlay_style.css',__FILE__ )); //register css;
		wp_enqueue_style( 'takePicCss', plugins_url('css/take-pic.css',__FILE__ )); //register css;
     }

    /**
     * function to register required ajax function
     */
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
     /**
      * Admin menu 
      */
    public function takePicAdminMenu(){
        
        
        if ( is_admin()):

        add_menu_page( 'Take Pic',
            'Take Pic' ,
            'administrator',
            'takePicAdminPanel',
             array($this, 'takePicAdminHtml'),
            'dashicons-camera-alt            ',
            '10');
 
            endif;
        
    }
    /** 
     * Admin menu html 
     */
    public function takePicAdminHtml(){
       
        ?>
        
        <div class="takePicAdminPanel">

        			<h1 class="dashicons-before dashicons-camera-alt">Take Pic</h1>
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
    
    /**
     * function to remove user upload with javscript
     * */
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
    
    /**
     * ajax function function tp handle remove request 
     */
    public function takePicAdminRemoveUploadAjax(){
       
        $uploadDir = wp_upload_dir();
        $userDir = $uploadDir['basedir'].'/'. $_POST['userlogin'];
        $old = umask(0);
        chmod($uploadDir['basedir'], 0777);
        umask($old);
        
        if(rmdir($userDir)):
            
            echo deleted;
        else:
        
            echo __("Not deleted.",'take-pic');
        
        endif;
 
        wp_die();
        
    }
    
  /*
   * 
   * frontend coding
   * 
   */  
    /** 
     * function to upload image with ajax 
     */
  public function ajaxUploadImage(){
          
    if(is_user_logged_in()):
    $current_user = wp_get_current_user();
       $uploadDir = wp_upload_dir();
       $userDirname = $uploadDir['basedir']. '/' . $current_user->user_login;
       
           if(!file_exists($userDirname)):
           
                      if(wp_mkdir_p($userDirname)):
                           if($this->base64ToPngSave($_POST['image'],$userDirname)):

                                echo __("Image sucessfully uploaded",'take-pic');
                           else:
                              echo __("Image couldn't be uploaded at this time",'take-pic');
                           endif;
                         else:
                             echo __("Image couldn't be uploaded at this time",'take-pic');
                         endif;
           else:
              
                   if($this->base64ToPngSave($_POST['image'],$userDirname)):
                        echo __("Image sucessfully uploaded",'take-pic');
                   else:
                   
                   $this->base64ToPngSave($_POST['image'],$userDirname);
                        echo __("Couldn't upload image, try again later",'take-pic');
                   endif;
              
           endif;
      
      else:
      
            echo __("You need to login to upload image",'take-pic');
      endif;
      
        wp_die();
       
    }
    
    /**
     * Convert blob to png and save 
     */
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
    
  
    
    
    /**
     * function to delete image
     */
    public function ajaxDeleteImage(){
    
        $uploadDir = wp_upload_dir();
      
        if(unlink($uploadDir['basedir'].str_replace(content_url().'/uploads', '', $_POST['image']))):
        
         echo "deleted";   
        
        else:
            echo __("Delete failed.",'take-pic');
        endif;

        wp_die();
    }
    
    
    /**
     * function to get all uploaded 
     */
    public function ajaxGetUploadedImages(){

        if(is_user_logged_in()):
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
            else:
                echo json_encode(array('notLoggedIn'=>__('You need to login to view images','take-pic')));
            endif;
        wp_die();
    }


/**
 * Register block for plugin
 * 
 */
    public function takePicRegisterBlock(){


        // Block Editor Script.
   wp_register_script(
       'take-pic-block-editor',
       plugins_url( 'js/take-pic-block.js',__FILE__ ),
       array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n','jsMasonry' ),
    );

    wp_localize_script( 'take-pic-block-editor', 'takePic', $this->getUserUploadedImgs());

    register_block_type(
       'take-pic/take-pic-block',
       array(
          'style'         => '',
          'editor_style'  => '',
          'editor_script' => 'take-pic-block-editor',
       )
    );
   
    }
/**
 * Get uploaded images by logged in user
 * */
public function getUserUploadedImgs(){

    $current_user = wp_get_current_user();
       $uploadDir = wp_upload_dir();
     
       
 
       $userDirname = $uploadDir['basedir']. '/' . $current_user->user_login;
        $imgArr = scandir($userDirname);
        unset($imgArr[0]);
        unset($imgArr[1]);
       return array( 'dirUrl'=>content_url().'/uploads/'.$current_user->user_login,
       'files'=> $imgArr
);
    }

  /**
   * since 2.5.0
   * Eneque Js masonry on admin section
   * 
   *  */  
    public function enequeAdminJs(){
        wp_enqueue_script('jsMasonry', plugins_url( 'js/js-masonry.js',__FILE__ ),array());
    } 
   
    /**
     * 
     * since 2.5.0
     * 
     * Eneque forntend js files
     */

     public function enequeFrontendJs(){
        wp_enqueue_script('jsMasonry', plugins_url( 'js/js-masonry.js',__FILE__ ),array());
        wp_enqueue_script('takePicFrontEndJs', plugins_url( 'js/take-pic-frontend.js',__FILE__ ),array('jsMasonry'));
        wp_enqueue_script('ctcOverlayJs', plugins_url('js/ctc_overlay.js',__FILE__ ));
        wp_enqueue_script('takePicJs', plugins_url('js/take-pic.js',__FILE__ ),array('jsCrop'));
        wp_enqueue_script('jsCrop', plugins_url('js/js-crop.js',__FILE__ ));
        wp_localize_script( 'takePicJs', 'my_ajax_url', admin_url( 'admin-ajax.php' ) );
        wp_localize_script( 'takePicJs', 'takePicMessage', array(
                                                                'mobile_browser' => __("Mobile devices do not support this feature yet",'take-pic'),
                                                                'no_ssl' => __("You browser doesn't  support webcam feature.",'take-pic'),
                                                                'connection_error' => __("Connection error.",'take-pic'),
                                                                'delete_confirm' => __("Are you sure you want to delete this image?",'take-pic'),
                                                                'delete_success' => __("Image sucessfully deleted.",'take-pic'),
                                                                'delete_failed' => __("Could't delete image at this time.",'take-pic'),
                                                                'profile_pic' => __("will be profile pic.",'take-pic'),
                                                                'no_image' => __("You do not have any image to display.",'take-pic'),


        )) ;

     }

}
new takePicPlugin();

