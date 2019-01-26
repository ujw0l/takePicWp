	/*
	 *
	 *
	 *
	 * CTC Gallery Viewer
	 *  images in overlay carousel and gallery written in vanilla js
	 * https://ujwolbastakoti.wordpress.com/
	 * MIT license
	 *
	 *
	 *
	 */


"use strict";
class ctcOverlayViewer{

		  constructor(elem) {
			  this.addRemoveActiveGallery(this.prepareOverlay(elem));
			  this.onRequiredEventListener();

		  }

		 //function to prrepare overlay
		  prepareOverlay(elem){

			var overlayDiv =  document.getElementById("ctcOverlayV");

			 if( overlayDiv === null){


				            var overlayDiv = document.createElement('div');
							overlayDiv.id = "ctcOverlayV";
							overlayDiv.className = "ctcOverlayV";


							//image container
							let imageContainer = document.createElement('div');
							imageContainer.id = "ctcOverlayImageContainerV";
							imageContainer.className = "ctcOverlayImageContainerV";


							 let actionContainer =  document.createElement('div');
							 	 actionContainer.id = "takePicActionContainerV";
							 	 actionContainer.className = "takePicActionContainerV";
								imageContainer.appendChild(actionContainer);
						


							//close button span
							let ctcOverlayClosebtn = document.createElement('span');
							ctcOverlayClosebtn.id = "ctcOverlayClosebtnV";
							ctcOverlayClosebtn.className = "ctcOverlayClosebtnV";
							ctcOverlayClosebtn.setAttribute("title", "close");
							ctcOverlayClosebtn.setAttribute("onclick", "ctcOverlayViewer.closeOverlay();");


							//imageContainer.appendChild(ctcLoadedImgAltTitle);
							overlayDiv.appendChild(ctcOverlayClosebtn);
							overlayDiv.appendChild(imageContainer);
							document.body.insertBefore(overlayDiv,document.body.firstChild);


				}

			 return [elem,overlayDiv];

		 }

		 //function to add or remove active and inactive gallery
		  addRemoveActiveGallery(param){


		 	 var newImageCount =1;

		 	 if(param[0].classList.contains( "ctcActiveGalleryV" ) === false){

		 		 var sideGalleryContainer = document.getElementById("ctcOverlayThumbGalleryContainerV");

		 		 if(sideGalleryContainer !== null){
		 			 ctcOverlayViewer.removeElem([sideGalleryContainer]);

		 		 }

		 		 var activeGallery = document.getElementsByClassName("ctcActiveGalleryV");

		 		 if(activeGallery.length >= 1){

		 			 var attr = ['data-v-img-number','onclick'];
		 			 var allOldImg  = ctcOverlayViewer.objectToArray(activeGallery[0].getElementsByTagName('img'));

		 							 allOldImg.map(x =>ctcOverlayViewer.removeElemAttr(attr,x));
		 							 ctcOverlayViewer.removeClass(["ctcActiveGalleryV"],activeGallery[0]);


		 				}


		 		 ctcOverlayViewer.addElemClass(["ctcActiveGalleryV"],param[0]);




		 		 var newActiveImages = ctcOverlayViewer.objectToArray(param[0].getElementsByTagName('img'));
		 			 newImageCount = newActiveImages.length;
		 		 let gallerySpanHeight = Math.round(0.045*window.screen.width);

		 		 if(newActiveImages.length >=2){

		 			 var errorCount = 0;
		 			 var sideGalleryContainer = ctcOverlayViewer.addElemClass(["ctcOverlayThumbGalleryContainerV"],document.createElement('div'));
		 			 param[1].insertBefore(sideGalleryContainer,  param[1].firstChild);
		 			 sideGalleryContainer.id="ctcOverlayThumbGalleryContainerV";


		 			 newActiveImages.map( function(img,i=0){

		 			 var thumbImage = new Image();


		 			 thumbImage.src = img.src;

		 			 ctcOverlayViewer.setElemAttr([['onclick','ctcOverlayViewer.loadOverlayImages('+i+');']],img);

		 			 let imgNumb = i;

		 			 thumbImage.onload = () => {

		 						var styleRule = [['display','block'],['background','url('+img.src+')'],['height',gallerySpanHeight+'px']];
		 						if(img.getAttribute("title") !==null){
		 							var ElemAttr = [['title',img.getAttribute("title")], ["alt",img.getAttribute("alt")],['onclick',img.getAttribute("onclick")]];
		 						}
		 						else{
		 							var ElemAttr = [['onclick',img.getAttribute("onclick")]];
		 						}
		 						
		 						
		 						sideGalleryContainer.appendChild(ctcOverlayViewer.setElemAttr(ElemAttr,ctcOverlayViewer.applyStyle(styleRule,document.createElement('span'))));

		 			 }
		 			 thumbImage.onerror =  () => {
		 						var ElemAttr = [["data-gal-unloaded-v",img.src],['title',img.getAttribute("title")], ["alt",img.getAttribute("alt")],['onclick',img.getAttribute("onclick")]];

		 						sideGalleryContainer.appendChild(ctcOverlayViewer.setElemAttr(ElemAttr,document.createElement('span')));

		 						errorCount++;
		 						if( errorCount === 1){

		 							 param[0].removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
		 							 param[0].addEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg);
		 							 param[1].removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
		 							 param[1].addEventListener('mouseover', ctcOverlayViewer.checkForUnloadedImg);
		 					 }


		 			 };


		 		 });

		 	 }
		 	 else{
		 		 ctcOverlayViewer.setElemAttr([['onclick','ctcOverlayViewer.loadOverlayImages('+0+');']],newActiveImages[0]);

		 	 }



		  }

		 	return param[0];
		  }

		 	//function on arrow keys press
		 	 onRequiredEventListener(){

		 		 var ctcOverlayContainer = document.getElementById("ctcOverlayV");

		 		//when screen resizes
		 		window.addEventListener('resize', () =>{

		 			if(ctcOverlayContainer !== null && ctcOverlayContainer.offsetHeight !== 0){
		 					var overlayImgContainer = document.getElementById("ctcOverlayImageContainerV");
		 					ctcOverlayViewer.loadOverlayImages(overlayImgContainer.getAttribute("data-v-overlay-img"),"yes");
		 			}

		 		});


		 		//on keypress do stuffs
		 		window.addEventListener('keydown', (event) => {

		 			if(ctcOverlayContainer.offsetHeight !== 0){
		 				if (event.code === 'ArrowUp' ||event.code === 'ArrowLeft'){

		 					let overlayImgContainer = document.getElementById("ctcOverlayImageContainerV");
		 					ctcOverlayViewer.loadOverlayImages(parseInt(overlayImgContainer.getAttribute("data-v-overlay-img"))-1);
		 					event.preventDefault();
		 				}
		 				else if (event.code === 'ArrowDown' || event.code == 'ArrowRight'){
		 					let overlayImgContainer = document.getElementById("ctcOverlayImageContainerV");
		 					ctcOverlayViewer.loadOverlayImages(parseInt(overlayImgContainer.getAttribute("data-v-overlay-img"))+1);
		 					event.preventDefault();
		 				}
		 				else if (event.code == 'Escape'){
		 					ctcOverlayViewer.closeOverlay();
		 					event.preventDefault();
		 				}
		 			}

		 		});

		 	}

			//function to check for images that has not been loaded on side gallery
	    static checkForUnloadedImg(unloadedGalImg){
	    	  var unloadedGalImg = document.querySelectorAll("#ctcOverlayThumbGalleryContainerV span[data-gal-unloaded-v]");


	    	  if( unloadedGalImg !== null){
	    		 var errorCount =0;


		    	  var overlayDiv= document.getElementById("ctcOverlayV");
		    	  let gallerySpanHeight = 0.045*window.screen.width;


		    	  ctcOverlayViewer.objectToArray(unloadedGalImg).map((imgSpan)=>{

						var thumbImage = new Image();
						let imgUrl = thumbImage.src = imgSpan.getAttribute("data-gal-unloaded-v");

						thumbImage.onload = ()=>{

							   var styleRule = [['display','block'],['opacity','0'],['background','url('+imgUrl+')'],['height',gallerySpanHeight+'px']];
							   ctcOverlayViewer.loadImageAnim(5,ctcOverlayViewer.applyStyle(styleRule,imgSpan).removeAttribute('data-gal-unloaded-v'));

						}
						thumbImage.onerror = ()=>{
										if(errorCount === 0){
											ctcOverlayV.removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
										 	var activeElem = document.getElementsByClassName("ctcActiveGalleryV")
										 	activeElem[0].removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
									    }
										errorCount++;

						}

		    	  });


	    	  }
	    	  else{
	    		  ctcOverlayV.removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
				  document.getElementsByClassName("ctcActiveGalleryV").removeEventListener("mouseover", ctcOverlayViewer.checkForUnloadedImg, true);
	    	  }

	      }

		 //function to apply style
		  static applyStyle(rules,elem){

			  let cssRules ='';

		       rules.map(x=> cssRules +=  x[0]+":"+x[1]+";");

			  elem.setAttribute("style",cssRules);
			  return  elem;
		  }

		 //function to set attribute of elment
		  static setElemAttr(attr,elem){

			  attr.map(x=>  elem.setAttribute(x[0],x[1]));
			  return elem;
		  }


		//function to set attribute of elment
		  static removeElemAttr(attr,elem){

			 attr.map(x => elem.removeAttribute(x));
			  return elem;
		  }

		//function to add class
		  static addElemClass(newClass,elem){

			  newClass.map(x=>elem.classList.add(x));

			  return elem;
		  }


		  //function remove class
		  static removeStyle(styleRule,elem){

			  styleRule.map(x=>elem.style.x[0]="");

			  return elem;
		  }

		  //function to remove class
		  static removeClass(removeClass,elem){

			  removeClass.map(x => elem.classList.remove(x));

			  return elem;
		  }


		  //function remove element
		  static removeElem(removeElem){

			  removeElem.map(x=> x.parentNode.removeChild(x));
		  }
		  //function to object into array
		  static objectToArray(obj){

				  var newArray =[];
						  Object.keys(obj).map( function(x){


							  if(Number.isInteger(parseInt(x))){
								    newArray.push(obj[x]);
								  }
						  });

						return newArray;

		  }

	//function to create open and close of overlay animation
	static openCloseAnimation(animation,elem){

		if(animation[0] == 'opacity' && animation[1] > 0 ){
			var opacity = 0;
			var margin = 50;
			var dime = 0;


			var intervalId = setInterval(()=>{




									if(opacity >= animation[1] &&  margin <= 0 && dime >= 100){

											clearInterval(intervalId);
										}
										else{

											  opacity = opacity+0.1;
											  margin = margin-10;
												dime = dime+20;
											if( opacity <=animation[1]){
											    elem.style.opacity =  opacity;
											}
											if(margin >=0){

													elem.style.top = margin+'%';
													elem.style.right = margin+'%';
													elem.style.bottom = margin+'%';
													elem.style.left =	margin+'%';
											}
											if(dime <= 100){
													elem.style.height = dime+'%';
													elem.style.width =	dime+'%';
											}

										}
									}, animation[2]/5,intervalId);




		}
		else{

			var opacity = animation[1];
			var margin = 0;
			var dime = 100;

			var intervalId = setInterval(()=>{

									if(opacity <= animation[1] &&  margin === 50 && dime === 0){


											clearInterval(intervalId);
										}
										else{

											opacity = opacity-0.1;
											margin = margin+5;
											dime = dime-10;
											if( opacity >=animation[1]){
											    elem.style.opacity =  opacity;
											}
											elem.style.opacity = animation[1];

											if(dime <= 0){
												elem.style.height = dime+'%';
												elem.style.width =	dime+'%';
											}

											if(margin >= 50){
													elem.style.top = margin+'%';
													elem.style.right = margin+'%';
													elem.style.bottom = margin+'%';
													elem.style.left =	margin+'%';
											}



										}
									}, animation[2]/5,intervalId);




		}

		return elem;
	}


	//function to create image load animation
	static loadImageAnim(imgTran,elem){

		elem.style.opacity = '0';
		elem.style.backgroundSize = "0% 0%";
		var imgDim = 0;

		var opacity = 0;
			var intervalId = setInterval(()=>{

				if(opacity >= 1 ){
					clearInterval(intervalId);
				}
				else{
					elem.style.opacity = opacity;
					elem.style.backgroundSize = imgDim+"% "+imgDim+"%";
				}


				opacity = opacity+0.1;
				if(imgDim < 100 ){
					imgDim = imgDim+10;
				}

			},imgTran);

			return elem;
	}





//function to run on close button lcik
  static closeOverlay(){

	  ctcOverlayViewer.applyStyle([['opacity',0],['width',0+'px']],ctcOverlayViewer.openCloseAnimation(['opacity',0,600],ctcOverlayViewer.applyStyle([['height',0+'px']],document.getElementById("ctcOverlayV"))));
	  document.getElementById("ctcOverlayImageContainerV").style.backgroundImage = "";
	  document.body.style.overflow= 'auto';
  }

  //function to get optimized image size
  static getOptimizedImageSize(screenWidth,screenHeight,imageActualWidth,imageActualHeight){

	  	var imageScreenHeightRatio = 0;
		var imageScreenWidthRatio =0;
		var optimizedImageHeight = 0;
		var optimizedImageWidth = 0;

	if((imageActualWidth >= screenWidth) && (imageActualHeight >= screenHeight )){
				if(imageActualWidth >= imageActualHeight){
										if(imageActualWidth > imageActualHeight ){

										     imageScreenWidthRatio = imageActualWidth/screenWidth;
										     optimizedImageWidth = (imageActualWidth/imageScreenWidthRatio)-(0.10*screenWidth);
										     optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);
													     if(optimizedImageHeight >=(0.90*screenHeight)){
													    	 imageScreenHeightRatio = screenHeight/imageActualHeight;
															 optimizedImageHeight = imageActualHeight*imageScreenHeightRatio-(0.10*screenHeight);
															 optimizedImageWidth = imageActualWidth*(optimizedImageHeight/imageActualHeight);
													     }
									}

						else{

									   if(screenWidth > screenHeight){
										   optimizedImageHeight = (0.90*screenHeight);
										   optimizedImageWidth =  optimizedImageHeight;

									     }
									   else if(screenHeight > screenWidth){

										   optimizedImageWidth = (0.90*screenWidth);
										   optimizedImageHeight =  optimizedImageWidth;

									   }
									   else{

										   imageScreenHeightRatio = screenHeight/imageActualHeight;
											 optimizedImageHeight = imageActualHeight*imageScreenHeightRatio-(0.10*screenHeight);
											 optimizedImageWidth = imageActualWidth*(optimizedImageHeight/imageActualHeight);
									   }
						}

		}
		else{
			 imageScreenHeightRatio = imageActualHeight/screenHeight;
			 optimizedImageHeight = (imageActualHeight/imageScreenHeightRatio)-(0.10*screenHeight);
			 optimizedImageWidth = imageActualWidth*(optimizedImageHeight/imageActualHeight);
		}

	}
	else if(imageActualWidth >= screenWidth &&  imageActualHeight  < screenHeight){
		 imageScreenWidthRatio = screenWidth/imageActualWidth;
		 optimizedImageWidth = imageActualWidth*imageScreenWidthRatio-(0.10*screenWidth);
		  optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);
	}
	else if(imageActualHeight >= screenHeight && imageActualWidth < screenWidth){
		 imageScreenHeightRatio = screenHeight/imageActualHeight;
		 optimizedImageHeight = imageActualHeight*imageScreenHeightRatio-(0.10*screenHeight);
		 optimizedImageWidth = imageActualWidth*(optimizedImageHeight/imageActualHeight);
		 optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);
	}
	else{
				var avilableImageWidth =  0.90*screenWidth;
				var avilableImageHeight =  0.90*screenHeight;
				if(imageActualWidth >= avilableImageWidth &&  imageActualHeight >= avilableImageHeight){
					var imageAvilableWidthRatio = avilableWidth/imageActualWidth;
					imageAvilableHeightRatio = avilableHeight/imageActualHeight;
						 optimizedImageWidth = avilableWidth*imageAvilableWidthRatio;
				         optimizedImageHeight = screenHeight*imageScreenHeightRatio;
				}
				else if(imageActualWidth >= avilableImageWidth &&  imageActualHeight < avilableImageHeight ){
					 var imageAvilableWidthRatio = avilableImageWidth/imageActualWidth;
					 optimizedImageWidth = imageActualWidth*imageAvilableWidthRatio;
					  optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);
				}
				else if(imageActualHeight >= avilableImageHeight && imageActualWidth < avilableImageWidth){
					 var imageAvilableHeightRatio = avilableImageHeight/imageActualHeight;
					 optimizedImageHeight = imageActualHeight*imageAvilableHeightRatio;
					 optimizedImageWidth = imageActualWidth*(optimizedImageHeight/imageActualHeight);
				}
				else{
					optimizedImageWidth = imageActualWidth;
					optimizedImageHeight = imageActualHeight;
				}
				optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);
	}


//at last check it optimized width is still large
if(optimizedImageWidth>(0.90*screenWidth)){
optimizedImageWidth = 0.90*screenWidth;
optimizedImageHeight = imageActualHeight*(optimizedImageWidth/imageActualWidth);

}

	 return [optimizedImageWidth,optimizedImageHeight];

  }


 //function to optimize font size
  static optFontSize(screenWidth){

		let optimizedFont = (screenWidth/1280)*120;

		if(optimizedFont < 50){

			return 50;

		}
		else if(optimizedFont < 70){

				return 70;
		}
		else if(optimizedFont > 120){
			return 120;
	   }
		else{

			return optimizedFont;
		}

	}

/*
 * function to load overlay image
 *
 */



static loadOverlayImages(currentImageNumber,resize){



	 document.body.style.overflow= 'hidden';
					var image = new Image();
					const imageNumberToLoad = parseInt(currentImageNumber);

					const overlayImg = document.querySelectorAll('img[onclick="ctcOverlayViewer.loadOverlayImages('+currentImageNumber+');"]');
					const overlay = document.getElementById("ctcOverlayV");
				    const closeBtn =  document.getElementById("ctcOverlayClosebtnV");

					const overlayImgContainer = document.getElementById("ctcOverlayImageContainerV");


					let prevImgNum = overlayImgContainer.getAttribute("data-v-overlay-img");
		            let prevGalImg = document.querySelectorAll('span[onclick="ctcOverlayViewer.loadOverlayImages('+prevImgNum+');"]');
					let screenWidth = window.screen.width;
					let screenHeight = window.screen.height;
					let windowWidth = window.innerWidth;
					let windowHeight = window.innerHeight;
					let activeGallery = document.getElementsByClassName("ctcActiveGalleryV");
					let totalImageCount = activeGallery[0].getElementsByTagName('img').length;

					 if(imageNumberToLoad < 0 || totalImageCount < imageNumberToLoad+1){


						 return;
					 }
					 else{

						    var imageToLoad = image.src = overlayImg[0].src;

					 }




					//special case when window is not in full screen
					 //while window is resized little bit

					 if(windowWidth !== screenWidth  || screenHeight !== windowHeight){
						screenWidth =  windowWidth;
						screenHeight = windowHeight;

					 }

						var imgDim =   ctcOverlayViewer.getOptimizedImageSize(screenWidth,screenHeight,image.width,image.height);
						let optimizedImageWidth = Math.round(imgDim[0]);
						let optimizedImageHeight = Math.round(imgDim[1]);


					  if(overlay.offsetHeight === 0){

							ctcOverlayViewer.openCloseAnimation(['opacity',1,500],ctcOverlayViewer.applyStyle([['opacity',1],['top','0'],['left','0'],['right','0'],['bottom','0']],overlay));
						}
						else{
							ctcOverlayViewer.applyStyle([['opacity',1],['top','0'],['left','0'],['right','0'],['bottom','0'],['height','100%'],['width','100%']],overlay);
						}


		           //optimize font for screen resolution
					let optimizedFontSize=  ctcOverlayViewer.optFontSize(screenWidth);


	 document.body.style.overflow= 'hidden';

	 ctcOverlayViewer.addElemClass(['overlayContentloadingV'],closeBtn);

	 image.addEventListener('load', function() {

		 						const sideImgGallery = document.getElementById("ctcOverlayThumbGalleryContainerV");
							   	let containerMarginTop = Math.round(screenHeight-optimizedImageHeight)/2;
								let navIconMargin = Math.round((optimizedImageHeight-(1.6*optimizedFontSize))/2);
								let closeMarginTop =   Math.round(containerMarginTop-(closeBtn.offsetHeight/1.2));
								let galleryRightNav = document.getElementById("ctcGalleryRightNavV");
							   	let galleryLeftNav = document.getElementById("ctcGalleryLeftNavV");


			  		              if(galleryRightNav !== null){
			  		            	ctcOverlayViewer.removeElem([ galleryRightNav]);

			  		              }

			  		            if(galleryLeftNav !== null){
			  		            	ctcOverlayViewer.removeElem([galleryLeftNav]);

			  		              }

			  		          //script to load image and margin of close button

								 ctcOverlayViewer.removeClass(['overlayContentloadingV'],closeBtn);
			  		              if(prevGalImg[0] !== undefined){
			  		            	ctcOverlayViewer.removeClass(['ctcOverlayThumbGalleryActiveV'],prevGalImg[0]);

			  		              }



									if(totalImageCount>=2){

										var gallerySpanHeight = 0.045*screenWidth;

												if(resize ==='yes'){


													ctcOverlayViewer.objectToArray(sideImgGallery.children).map(x=>x.style.height=gallerySpanHeight+"px");

												}

										var activeGallerySpan = sideImgGallery.querySelectorAll('span[onclick="'+overlayImg[0].getAttribute("onclick")+'"]');

									 if(activeGallerySpan[0] !== undefined){

											if( activeGallerySpan[0].getAttribute("data-gal-unloaded-v") !== null){

												var elemStyle = [["display","block"],["background",'url("'+imageToLoad+'")'],["height", gallerySpanHeight+"px"],["width", gallerySpanHeight+"px"]];
												ctcOverlayViewer.addElemClass(['ctcOverlayThumbGalleryActiveV'],
														                      ctcOverlayViewer.removeElemAttr(["data-gal-unloaded-v"],
														                    		                          ctcOverlayViewer.applyStyle(elemStyle,activeGallerySpan[0])));
											}


											ctcOverlayViewer.addElemClass(['ctcOverlayThumbGalleryActiveV'],activeGallerySpan[0]).scrollIntoView({behavior: "smooth", block: "center"});


										}


										if((totalImageCount*(gallerySpanHeight+4)) < screenHeight){
											
											if(sideImgGallery.firstChild !== null){
												sideImgGallery.style.paddingTop  = (screenHeight-(totalImageCount*(gallerySpanHeight+9)))/2+"px";
											}
										}


										let countAndCurrent = document.getElementById("ctcOverlayCountAndCurrentImageV");

										if( countAndCurrent === null){

											countAndCurrent = document.createElement('div');
											countAndCurrent.id = "ctcOverlayCountAndCurrentImageV";
											countAndCurrent.className = "ctcOverlayCountAndCurrentImageV";
											overlayImgContainer.appendChild(countAndCurrent);
										}

										overlayImgContainer.setAttribute('data-v-overlay-img',imageNumberToLoad);

										let containerMarginLeft = Math.round((0.955*screenWidth)-optimizedImageWidth)/2;


										let style = [['opacity','0'],["background-image",'url('+imageToLoad+')'],['height',Math.round(optimizedImageHeight)+"px"],['width',Math.round(optimizedImageWidth)+"px"],['margin-left',containerMarginLeft+"px"],["margin-top",containerMarginTop+"px"]];

										ctcOverlayViewer.applyStyle(style,ctcOverlayViewer.loadImageAnim(8,overlayImgContainer));


										if(optimizedFontSize < 51){

											ctcOverlayViewer.applyStyle([["margin-right",containerMarginLeft+"px"],['margin-top',closeMarginTop+"px"],['font-size','35px']],closeBtn);


										}
										else{
											ctcOverlayViewer.applyStyle([["margin-right",containerMarginLeft+"px"],['margin-top',closeMarginTop+"px"]],closeBtn)

										}


									
										
										//first add image counr and current images
										if(imageNumberToLoad-1 >= 0  && imageNumberToLoad+1 < totalImageCount){

											 overlayImgContainer.appendChild(ctcOverlayViewer.addElemClass(['ctcGalleryRightNavV'],
															     ctcOverlayViewer.setElemAttr([['title','Next Image'],["onclick","ctcOverlayViewer.loadOverlayImages("+(imageNumberToLoad+1)+");"],['id','ctcGalleryRightNavV']],
															     ctcOverlayViewer.applyStyle([['margin-top',navIconMargin+"px"],['font-size',optimizedFontSize+'px']],document.createElement('span')))));

											 overlayImgContainer.appendChild(ctcOverlayViewer.addElemClass(['ctcGalleryLeftNavV'],
													 			 ctcOverlayViewer.setElemAttr([['title','Previous Image'],["onclick","ctcOverlayViewer.loadOverlayImages("+(imageNumberToLoad-1)+");"],['id','ctcGalleryLeftNavV']],
													 			 ctcOverlayViewer.applyStyle([['margin-top',navIconMargin+"px"],['font-size',optimizedFontSize+'px']],document.createElement('span')))));




											 countAndCurrent.innerHTML = (imageNumberToLoad+1)+' of '+totalImageCount;

										}
										else if(imageNumberToLoad-1 < 0  && imageNumberToLoad+1 < totalImageCount){

											//add element left and right nav
											overlayImgContainer.appendChild(ctcOverlayViewer.addElemClass(['ctcGalleryRightNavV'],
												     ctcOverlayViewer.setElemAttr([['title','Next Image'],["onclick","ctcOverlayViewer.loadOverlayImages("+(imageNumberToLoad+1)+");"],['id','ctcGalleryRightNavV']],
												     ctcOverlayViewer.applyStyle([['margin-top',navIconMargin+"px"],['font-size',optimizedFontSize+'px']],document.createElement('span')))));

											       countAndCurrent.innerHTML = (imageNumberToLoad+1)+' of '+totalImageCount;

										}
										else if (imageNumberToLoad-1 >= 0 && imageNumberToLoad+1 >= totalImageCount){

											 		 overlayImgContainer.appendChild(ctcOverlayViewer.addElemClass(['ctcGalleryLeftNavV'],
										 			 ctcOverlayViewer.setElemAttr([['title','Previous Image'],["onclick","ctcOverlayViewer.loadOverlayImages("+(imageNumberToLoad-1)+");"],['id','ctcGalleryLeftNavV']],
										 			 ctcOverlayViewer.applyStyle([['margin-top',navIconMargin+"px"],['font-size',optimizedFontSize+'px']],document.createElement('span')))));
											document.getElementById("ctcOverlayCountAndCurrentImageV").innerHTML = (imageNumberToLoad+1)+' of '+totalImageCount;

										}





					}
					else{
						let countAndCurrent = document.getElementById("ctcOverlayCountAndCurrentImageV");
						if(countAndCurrent !== null){
							countAndCurrent.parentNode.removeChild(countAndCurrent);
						}


						//set left margin for image container
						overlayImgContainer.setAttribute('data-v-overlay-img',imageNumberToLoad);

						let containerMarginLeft = Math.round((screenWidth-optimizedImageWidth)/2);

						ctcOverlayViewer.applyStyle([["background-image","url("+imageToLoad+")"],
													 ["margin-left",containerMarginLeft+"px"],
													 ["margin-top",containerMarginTop+"px"],
													 ["width",optimizedImageWidth+"px"],
													 ["height",optimizedImageHeight+"px"]],overlayImgContainer);

						ctcOverlayViewer.applyStyle([["margin-right",containerMarginLeft+"px"],["margin-top",closeMarginTop+"px"]],closeBtn);
					}


									sideImgGallery.style.opacity="1";
	 	});


   
	 
	 /*added functionalities for take pic*/
	 let actionContainer = document.getElementById("takePicActionContainerV");
	 var deletePicButton = document.getElementById("takePicDeleteButton") ;
	var takePicUploadButton = document.getElementById('takePicUploadButton');
	 
	if(document.getElementById("takePicOverlay") !==null){ 
		
		
		
			if( deletePicButton !== null){
			 
				deletePicButton.parentNode.removeChild(deletePicButton);
				
			}
			 //add file upload icon to image
			 if(takePicUploadButton === null){
				
				let uploadButton =  document.createElement('a');
					uploadButton.id = "takePicUploadButton";
					uploadButton.setAttribute("title","Upload this image");
					uploadButton.setAttribute("href", "JavaScript:void(0);");
					uploadButton.setAttribute("onclick", "takePic.uploadImage('"+imageToLoad+"')");
					actionContainer.appendChild(uploadButton);
			 }
			 else{
				
				 takePicUploadButton.setAttribute("onclick", "takePic.uploadImage('"+imageToLoad+"')");
					
				 
			 }
	}
	else if(document.getElementById("hiddenImageAlbum") !== null){
		
		 if( takePicUploadButton !== null){
			 
			 takePicUploadButton.parentNode.removeChild(takePicUploadButton);
		 }
		//add file upload icon to image
		 if( deletePicButton === null){
			
				
			let takePicDeleteButton =  document.createElement('a');
				takePicDeleteButton.id = "takePicDeleteButton";
				takePicDeleteButton.setAttribute('title',"Delete this picture");
				takePicDeleteButton.setAttribute("href", "JavaScript:void(0);");
				takePicDeleteButton.setAttribute("onclick", "takePic.deleteImage('"+imageToLoad,currentImageNumber+"')");
				actionContainer.appendChild(takePicDeleteButton);
		
		 }
		 else{
	
			
			 deletePicButton.setAttribute("onclick", "takePic.deleteImage('"+imageToLoad+"','"+currentImageNumber+"')");	
			 
		 }
		
	}
	

}//end of function loadoverlay









}
