/**
 * Take picture with webcam and save them
 *
 *
 */


//console.log(import ctcOverlayViewer from 'ctc_overlay');
class takePic{

	constructor(){
		if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)){
			
			alert("Mobile devices do not support this feature yet");
			
			}
		else{
				this.webCamOverlayHtml();
				this.accessCamera();
				document.getElementById("videoStream").addEventListener("click",this.takeSnapshot);
		
			   window.addEventListener("resize",this.resizeSnapShot);
		}
	}

	//function to add video camera in overlay
	webCamOverlayHtml(){
		
		let overlayDiv = document.createElement('div');
		overlayDiv.id = "takePicOverlay";
		overlayDiv.className = "takePicOverlay";
		document.body.insertBefore(overlayDiv,document.body.firstChild);
			 			 	 
			 let sideGallery = document.createElement('div');
		    	sideGallery.id = "sideImageGallery";
		    	sideGallery.className = "sideImageGallery";
				ctcOverlayViewer.setElemAttr([["onmouseover","new ctcOverlayViewer(this);"],["title","Click to enlarge image"]],sideGallery);
		    	overlayDiv.appendChild(sideGallery);
	
		     		
				
		    	//video container
		    	let videoContainer = document.createElement('div');
				videoContainer.id = "videoContainer";
				videoContainer.setAttribute("title","Click anywhere in video to take picture");
				videoContainer.className = "videoContainer";
				overlayDiv.appendChild(videoContainer);
				
				
				
				let closeButton = document.createElement('div');
		    	closeButton.id = "takePicClose";
		    	closeButton.setAttribute("title","Close camera ");
		    	closeButton.setAttribute("onclick", "takePic.closeCameraView();");
		    	closeButton.className = "takePicClose";
		    	overlayDiv.appendChild(closeButton);
				
		    	

				//video element
				let videoStream = document.createElement('video');
					videoStream.id = "videoStream";
					videoStream.setAttribute("autoPlay","true");
					videoContainer.appendChild(videoStream);


					//create canvas to buffer captured image
				let imageCanvas = 	document.createElement('canvas');
					imageCanvas.id = "imageCaptureCanvas";
						imageCanvas.style.display="none"
					overlayDiv.appendChild(imageCanvas);

	}


	//function to stream video
	accessCamera(){

		var video = document.getElementById("videoStream");
		var imageCapture;

		if (navigator.mediaDevices.getUserMedia) {
		    navigator.mediaDevices.getUserMedia({video: true})
		  .then((mediaStream) => {
			  document.getElementById('videoStream').srcObject = mediaStream;
			  const track = mediaStream.getVideoTracks()[0];
			       imageCapture = new ImageCapture(track);
		  })
		  .catch((error) =>{
		    console.log(error);
		  });
		}

		
	}

	//funcition to take image
	 takeSnapshot(){

		 let hidden_canvas = document.getElementById('imageCaptureCanvas');
		 let sideGallery = document.getElementById('sideImageGallery');
		 let video = document.getElementById('videoStream');
		 let image = document.createElement('img');
		 let width = video.videoWidth;
		 let height = video.videoHeight;

     // Set the canvas to the same dimensions as the video.
     hidden_canvas.width = width;
     hidden_canvas.height = height;


		 // Context object for working with the canvas.
		 let context = hidden_canvas.getContext('2d');
		 
     // Draw a copy of the current frame from the video on the canvas.
     context.drawImage(video, 0, 0, width,height);

     // Get an image dataURL from the canvas.
     var imageDataURL = hidden_canvas.toDataURL('image/png');

     // Set the dataURL as source of an image element, showing the captured photo.
     image.setAttribute('src', imageDataURL);
		 image.style.height = (0.9*sideGallery.offsetWidth*height/width)+"px";
		 ctcOverlayViewer.removeClass(["ctcActiveGalleryV"],sideGallery);
		 sideGallery.insertBefore(image,sideGallery.firstChild);
		 image.scrollIntoView({behavior: "smooth", block: "center"})
	}


//function to resize the the components based on screen size
resizeSnapShot(){


let sideGallery = document.getElementById('sideImageGallery');
let video = document.getElementById('videoStream');
let width = video.videoWidth;
let height = video.videoHeight;
let sideGalImgWidth = (0.9*sideGallery.offsetWidth*height/width)+"px";



ctcOverlayViewer.applyStyle([["height",sideGalImgWidth]],
									ctcOverlayViewer.objectToArray(sideGallery.getElementsByTagName("img")).map((img)=>img.style.height =sideGalImgWidth));



}

//function to close camera view stream
	static closeCameraView(){
		let stream = document.getElementById('videoStream').srcObject;
		  let tracks = stream.getTracks();

		  tracks.forEach(function(track) {
		    track.stop();
		  });
		
		let element = document.getElementById("takePicOverlay");
		element.parentNode.removeChild(element);
		
		
		
		
	}
	
	
	//function to upload imge to server
	static uploadImage(blob){
		
		
		var xhttp =  new XMLHttpRequest();
		xhttp.open("POST", my_ajax_url, true);
		xhttp.responseType = "text";
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		
		xhttp.onload = function () {
	        if (this.status >= 200 && this.status < 400) {
	        	
	          
	            alert(this.response);
	        } else {
	        	
	            alert(this.response);
	        }
	    };
	    
	    xhttp.onerror = function() {
	    	
	        alert("connection error");
	    };
		
		
		xhttp.send("action=ajaxUploadImage&image="+blob);
	
		
	}
	
	//function to upload imge to server
	static deleteImage(fileName,imageNum){
	
	if(confirm("Are you sure you want to delete this image?")){	
		
		var xhttp =  new XMLHttpRequest();
		xhttp.open("POST", my_ajax_url, true);
		xhttp.responseType = "text";
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		
		xhttp.onload = function () {
	        if (this.status >= 200 && this.status < 400) {
	        	
	        	
	        	if(this.response === 'deleted'){
	        		
	        		alert("Image sucessfully deleted");
	        		
	        		takePic.removeDeletedImage(imageNum);
	        		
	        		let imageToLoad = parseInt(imageNum)-1;
	        		if(imageToLoad > -1){
	        				setTimeout(ctcOverlayViewer.loadOverlayImages(imageToLoad),100);
	        			}
	        		else{
	        			
	        			setTimeout(ctcOverlayViewer.loadOverlayImages(imageNum),100);
	        		}
	        		
	        	}
	        	else{
	        		
	        		
	        		alert("Can't delete at this time");
	        	}
	            
	        } else {
	        	
	            alert(this.response);
	        }
	    };
	    
	    xhttp.onerror = function() {
	    	
	        alert("connection error");
	    };
				
		xhttp.send("action=ajaxDeleteImage&image="+fileName);
	}
	
	}
	
	//function to upload imge to server
	static updateProfilePic(fileName){
		
		alert(fileName+' will be profile pic');
		var xhttp =  new XMLHttpRequest();
		xhttp.open("POST", my_ajax_url, true);
		xhttp.responseType = "text";
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		
		xhttp.onload = function () {
	        if (this.status >= 200 && this.status < 400) {
	        	
	            alert(this.response);
	        } else {
	        	
	            alert(this.response);
	        }
	    };
	    
	    xhttp.onerror = function() {
	    	
	        alert("connection error");
	    };
		
		xhttp.send("action=ajaxUpdateProfilePic&image="+fileName);
	
	}
	
	
	
	//function to access all uploaded images
	static viewUploadedImages(){
		
		var xhttp =  new XMLHttpRequest();
		xhttp.open("POST", my_ajax_url, true);
		xhttp.responseType = "json";
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
		
		xhttp.onload = function () {
	        if (this.status >= 200 && this.status < 400) {

	         if(this.response.length === 1){
	        	 
	        	 
	        	 alert("You do not have any image to display");
	        
	          }
	         else{
	        	 
	        	 let oldImageAlbum = document.getElementById("hiddenImageAlbum");
	        	 
	        	 if(oldImageAlbum === null){
	        	 
	        			
					     takePic.createImageAlbum(this.response);	 
	        	 }
	        	 else{
	        		 		oldImageAlbum.remove();
	        		 		takePic.createImageAlbum(this.response);
	        	 }
	        	
	         }
	        } else {
	            alert(this.response);
	        }
	    };
	    
	    xhttp.onerror = function() {
	    	
	        alert("connection error");
	    };
		
		xhttp.send("action=ajaxGetUploadedImages");

	}
	

	//function to create hidden image album based on ajax response
	static  createImageAlbum(response){

		var imgDir = response.dir;
   	 	var imageAlbum  = document.createElement('div');
   	 	imageAlbum.id = "hiddenImageAlbum";
   	 	imageAlbum.style.display = "none";
   	 	imageAlbum.setAttribute("onmouseover","new ctcOverlayViewer(this);");
   	 	
	
   	ctcOverlayViewer.objectToArray(response.images).map((x)=>{
   		
   		if(x.indexOf(".png") !== -1){
   		
   			let userImg = document.createElement('img');
   				userImg.setAttribute('src',imgDir+'/'+x);
   				imageAlbum.appendChild(userImg);
   			
   		}
   		document.body.insertBefore(imageAlbum,document.body.firstChild);
   		
   		setTimeout(function(){
   			
   				var mouseOverEvent = new Event('mouseover');
	   			var clickEvent = new Event("click");
	   		 
	   		 
	   			var  newHiddenAlbum =   document.getElementById("hiddenImageAlbum");
	   		 
	   					newHiddenAlbum.dispatchEvent(mouseOverEvent)
	   	 		
	   	 			setTimeout(newHiddenAlbum.getElementsByTagName("img")[0].dispatchEvent(clickEvent),200);
   			
   		}, 500);
   		
   	});
		
	}
	
	
	//function to remove deleted images from document
	static removeDeletedImage(imageNum){
		
		let hiddenAlbum =  document.getElementById("hiddenImageAlbum");
		let deletedImage = hiddenAlbum.querySelectorAll('img[onclick="ctcOverlayViewer.loadOverlayImages('+imageNum+');"]')[0];
		
			deletedImage.parentNode.removeChild(deletedImage);
		
		var sideGallery = document.getElementById("ctcOverlayThumbGalleryContainerV");
		if(sideGallery !== null){
			let deletedGalImage = sideGallery.getElementsByClassName("ctcOverlayThumbGalleryActiveV")[0];
			 	deletedGalImage.parentNode.removeChild(deletedGalImage);
			 	var  allSideGalImg = ctcOverlayViewer.objectToArray(sideGallery.getElementsByTagName("span"));	
			}
		 
		 
		 //change onclick attribute of images
		 let allAlbumImg = ctcOverlayViewer.objectToArray(hiddenAlbum.getElementsByTagName("img"));	

		 if(allAlbumImg.length  > 0){
			 allAlbumImg.map((el,i)=>{
					
				 el.setAttribute("onclick","ctcOverlayViewer.loadOverlayImages("+i+");");
				 if(sideGallery !== null){
					 if(allAlbumImg.length === 1){
						 sideGallery.parentNode.removeChild(sideGallery);
					 }
					 else{
					 	  allSideGalImg[i].setAttribute("onclick","ctcOverlayViewer.loadOverlayImages("+i+");");
					 }
				 }
				 
			 });
		 }
		 
		 else{
			 
			 	ctcOverlayViewer.closeOverlay();
			 	
		 }
		 
		
		 	
		
	} 	


}






