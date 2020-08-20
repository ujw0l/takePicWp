/**
 * Take picture with webcam and save them  written in vanilla js
 * https://ujwolbastakoti.wordpress.com/
 * MIT license
 *
 *
 *
 */


class takePic {

	constructor() {

		this.accessCamera();
		this.webCamOverlayHtml();
		window.addEventListener("resize", () => { this.resizeSnapShot() });

	}


	//function to add loading page
	webCamloading(overlayId) {

		let loadingDiv = document.createElement('div');
		loadingDiv.id = "takePicLoading";
		loadingDiv.classList.add('takePicLoading');
		loadingDiv.innerHTML = 'Loading . . .';
		document.getElementById(overlayId).appendChild(loadingDiv);

	}

	//function to add video camera in overlay
	webCamOverlayHtml() {


		window.scrollTo(0, 0);

		document.querySelector('#wpadminbar').style.zIndex = '99998';
		let overlayDiv = document.createElement('div');
		overlayDiv.id = "takePicOverlay";
		overlayDiv.className = "takePicOverlay";
		overlayDiv.style = `width: 100%;height: 100%;position: fixed;z-index: 99999;background-color: rgba(8, 2, 12, 1);max-height: 100%;overflow: hidden;top: 0;left: 0;`;
		document.body.insertBefore(overlayDiv, document.body.firstChild);

		//add loading div
		this.webCamloading('takePicOverlay');

		//filter container
		var filterContainer = document.createElement('div');
		filterContainer.id = "takePicFilterContainer";
		filterContainer.classList = "takePicFilterContainer";
		overlayDiv.appendChild(filterContainer);



		let sideGallery = document.createElement('div');
		sideGallery.id = "sideImageGallery";
		sideGallery.className = "sideImageGallery";
		sideGallery.title = "Click to enlarge image";
		overlayDiv.appendChild(sideGallery);


		//video container
		let videoContainer = document.createElement('div');
		videoContainer.id = "videoContainer";
		videoContainer.className = "videoContainer";
		overlayDiv.appendChild(videoContainer);

		let closeButton = document.createElement('span');
		closeButton.id = `takePicClose`;
		closeButton.style = `;position:absolute;width:20px;height;20px;font-size:20px;color:rgba(0,0,0,1);cursor:pointer;`;
		closeButton.title = "Close";
		closeButton.innerHTML = "&#10539;";
		closeButton.addEventListener('click', () => {
			let stream = document.getElementById('videoStream').srcObject;
			let tracks = stream.getTracks();
			tracks.forEach(function (track) {
				track.stop();
			});
			document.body.removeChild(document.querySelector('#takePicOverlay'));
		});

		videoContainer.appendChild(closeButton);

		//video element
		let videoStream = document.createElement('video');
		videoStream.id = "videoStream";
		videoStream.setAttribute("data-filter", "cssFilterNone");
		videoStream.setAttribute("autoPlay", "true");
		videoContainer.appendChild(videoStream);

		let buttonDiv = document.createElement('div');
		buttonDiv.id = "buttonsDiv";
		buttonDiv.classList = 'buttonsDiv';


		//create element for take take snap shot
		let captureButton = document.createElement('span');
		captureButton.id = "captureButton";
		captureButton.setAttribute("title", "Take Picture");
		buttonDiv.appendChild(captureButton);
		videoContainer.appendChild(buttonDiv);

		if (navigator.userAgent.indexOf('Chrome') > -1 || navigator.userAgent.indexOf('Firefox') > -1) {

			//create slection video with filter	
			takePic.getFilterArrayObj('prop').map(
				(x) => {
					let videoEl = document.createElement("video");

					if (x === 'None') {
						videoEl.setAttribute('class', 'filterVideoStream filterVideoStreamActive');
					} else {
						videoEl.setAttribute('class', 'filterVideoStream');
					}
					videoEl.setAttribute("autoPlay", "true");
					videoEl.setAttribute("id", "takePicFilter" + x);
					videoEl.setAttribute('title', "Apply this effect");
					videoEl.setAttribute("style", takePic.getFilterArrayObj("cssFilter" + x));
					videoEl.addEventListener('click', () => this.applyFilter(`cssFilter${x}`));
					filterContainer.appendChild(videoEl);
				});
		}

		//create canvas to buffer captured image
		let imageCanvas = document.createElement('canvas');
		imageCanvas.id = "imageCaptureCanvas";
		imageCanvas.style.display = "none"
		overlayDiv.appendChild(imageCanvas);
		document.getElementById("captureButton").addEventListener("click", this.takeSnapshot);
	}


	//function to stream video
	accessCamera() {

		var video = document.getElementById("videoStream");

		var imageCapture;




		if (navigator.mediaDevices.getUserMedia) {

			navigator.mediaDevices.getUserMedia({
				video: true
			})
				.then((mediaStream) => {

					document.getElementById('videoStream').srcObject = mediaStream;
					let imgStreams = document.getElementsByClassName('filterVideoStream');
					for (var i in imgStreams) {
						if (i >= 0) {
							imgStreams[i].srcObject = mediaStream;
						}
					}


					document.getElementById('takePicLoading').parentNode.removeChild(document.getElementById('takePicLoading'));
					setTimeout(function () {
						let video = document.getElementById("videoStream");
						let overlayDiv = document.getElementById('takePicOverlay');

						let optVideoSize = takePic.getOptimizedVideoSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, video.videoWidth, video.videoHeight)
						document.querySelector('#takePicClose').style.color = `rgba(255,255,255,1)`;
						document.getElementById("captureButton").style.opacity = '1';
						video.style.width = optVideoSize.width + 'px';
						video.style.height = optVideoSize.height + 'px'
						video.style.opacity = '1';
						if (null != document.getElementById("changeCamButton")) {
							document.getElementById("changeCamButton").style.opacity = '1';
						}



						takePic.positionDivs();
					}, 350);

					const track = mediaStream.getVideoTracks()[0];
					imageCapture = new ImageCapture(track);
				})
				.catch((error) => {
					console.log(error);
				});

			//enumerate all cameras
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				let i = 0;
				devices.map((device) => {
					if (device.kind == 'videoinput') {
						if (i >= 1) {
							//create element for take take snap shot
							let changeCam = document.createElement('span');
							changeCam.id = "changeCamButton";
							changeCam.setAttribute('data-cam', '1');
							changeCam.setAttribute('onclick', 'takePic.changeCam("' + device.deviceId + '");');
							changeCam.setAttribute("title", "Change Webcam");
							changeCam.innerHTML = '&#8635;';
							document.querySelector("#buttonsDiv").appendChild(changeCam);
						}
						i++;
					}
				});
			});

		}

	}

	//function to change camera
	static changeCam(camId) {
		document.getElementById('buttonsDiv').style.display = 'none';
		navigator.mediaDevices.enumerateDevices().then((devices) => {

			navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: camId
				}
			})
				.then((mediaStream) => {

					let video = document.getElementById("videoStream");
					video.srcObject = mediaStream;

					let overlayDiv = document.getElementById('takePicOverlay');
					let optVideoSize = takePic.getOptimizedVideoSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, video.videoWidth, video.videoHeight)
					document.getElementById("captureButton").style.opacity = '1';
					video.style.width = optVideoSize.width + 'px';
					video.style.height = optVideoSize.height + 'px'

					let imgStreams = document.getElementsByClassName('filterVideoStream');
					for (var i in imgStreams) {
						if (i >= 0) {
							imgStreams[i].srcObject = mediaStream;
						}
					}

					setTimeout(() => {
						document.getElementById("captureButton").style.opacity = '1';
						document.getElementById('buttonsDiv').style.display = '';

					}, 350);

					const track = mediaStream.getVideoTracks()[0];
					imageCapture = new ImageCapture(track);

				})
				.catch((error) => {
					console.log(error);
				});


			devices.map((device) => {
				if (device.kind === 'videoinput') {
					if (device.deviceId != camId) {
						document.getElementById("changeCamButton").setAttribute('onclick', 'takePic.changeCam("' + device.deviceId + '");');
					}

				}
			});

		});

	}

	//function to take image
	takeSnapshot() {

		document.querySelector('#takePicOverlay').style.backgroundColor = 'rgba(255, 255, 255, 1)';

		setTimeout(() => document.querySelector('#takePicOverlay').style.backgroundColor = 'rgba(8, 2, 12, 1)', 200);

		let hidden_canvas = document.getElementById('imageCaptureCanvas');
		let sideGallery = document.getElementById('sideImageGallery');
		let video = document.getElementById('videoStream');
		let image = document.createElement('img');
		let width = video.videoWidth;
		let height = video.videoHeight;
		let wdHtRatio = height / width;
		let timeStamp = new Date().getTime('millseconds');

		hidden_canvas.style = `width: 20%;height: 20%;float: right;border: 1px solid rgba(255, 255, 255, 0.5); display:none`;
		image.id = `take-pic-img-${timeStamp}`;
		image.style.height = (wdHtRatio * (0.95 * sideGallery.offsetWidth)) + 'px';
		image.addEventListener('mouseenter', () => {
			if ('active' != event.target.getAttribute('data-crop')) {



				event.target.setAttribute('data-crop', 'active')
				new jsCrop('#take-pic-img-' + timeStamp, { saveButton: false }, [
					{
						buttonText: '&#9729;',
						buttonTitle: 'Upload Image',
						callBack: (imgBlob) => {


							var xhttp = new XMLHttpRequest();
							xhttp.open("POST", my_ajax_url, true);
							xhttp.responseType = "text";
							xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
							xhttp.addEventListener('load', event => {

								if (event.target.status >= 200 && event.target.status < 400) {

									alert(event.target.response);
								} else {
									alert(event.target.response);
								}

							})
							xhttp.send("action=ajaxUploadImage&image=" + imgBlob);



						}



					}


				])
			}
		})

		// Set the canvas to the same dimensions as the video.
		hidden_canvas.width = width;
		hidden_canvas.height = height;


		// Context object for working with the canvas.
		let context = hidden_canvas.getContext('2d');
		let newFilter = takePic.sanitizeFilter(takePic.getFilterArrayObj(document.getElementById("videoStream").getAttribute("data-filter")));



		// Draw a copy of the current frame from the video on the canvas.
		context.filter = newFilter;
		context.drawImage(video, 0, 0, width, height);

		// Get an image dataURL from the canvas.
		var imageDataURL = hidden_canvas.toDataURL('image/png');

		// Set the dataURL as source of an image element, showing the captured photo.
		image.setAttribute('src', imageDataURL);
		image.style.height = (0.9 * sideGallery.offsetWidth * height / width) + "px";
		sideGallery.classList.remove("ctcActiveGalleryV");
		sideGallery.insertBefore(image, sideGallery.firstChild);
		image.scrollIntoView({
			behavior: "smooth",
			block: "center"
		});
		sideGallery.style.opacity = "1";
	}


	//function to resize the the components based on screen size
	resizeSnapShot() {

		let overlayDiv = document.querySelector('#takePicOverlay');
		let closeBtn = document.querySelector('#takePicClose');
		let sideGallery = document.querySelector('#sideImageGallery');
		let videoStream = document.querySelector('#videoStream');
		let sideGalImgs = sideGallery.querySelectorAll('img');
		let capturButton = document.querySelector('#captureButton');
		let camChangeButton = document.querySelector('#changeCamButton');
		let buttonWidthHeight = overlayDiv.offsetHeight > overlayDiv.offsetWidth ? (0.051 * overlayDiv.offsetWidth) : (0.051 * overlayDiv.offsetHeight);

		if (undefined != sideGalImgs) {

			let htWdRatio = videoStream.videoHeight / videoStream.videoWidth;
			let imgHeight = (htWdRatio * 0.95 * sideGallery.offsetWidth);
			for (var i in sideGalImgs) {
				if (i >= 0) {
					sideGalImgs[i].style.height = imgHeight + 'px';
				}

			}
		}

		if (buttonWidthHeight < 50) {
			capturButton.style.width = buttonWidthHeight + 'px';
			capturButton.style.height = buttonWidthHeight + 'px';
			if (null != camChangeButton) {
				camChangeButton.style.width = buttonWidthHeight + 'px';
				camChangeButton.style.height = buttonWidthHeight + 'px';
				camChangeButton.style.fontSize = (40 * (buttonWidthHeight / 50)) + 'px';
			}
		} else {
			capturButton.style.width = 50 + 'px';
			capturButton.style.height = 50 + 'px';
			if (null != camChangeButton) {
				camChangeButton.style.width = 50 + 'px';
				camChangeButton.style.height = 50 + 'px';
				camChangeButton.style.fontSize = '40px';
			}
		}

		let optVideoSize = takePic.getOptimizedVideoSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, videoStream.videoWidth, videoStream.videoHeight);
		videoContainer.style = `height:${0.8 * overlayDiv.offsetHeight}px;width:${0.8 * overlayDiv.offsetWidth}px;top:${0.1 * overlayDiv.offsetHeight}px;left:${0.1 * overlayDiv.offsetWidth}px;`;
		videoStream.style = `height:${optVideoSize.height}px;width:${optVideoSize.width}px;margin-top:${((videoContainer.offsetHeight - videoStream.offsetHeight) / 2)}px`;
		buttonsDiv.style.marginTop = ((videoContainer.offsetHeight / 2) - capturButton.offsetHeight) + 'px';
		closeBtn.style.marginTop = (((videoContainer.offsetHeight - videoStream.offsetHeight) / 2) - closeBtn.offsetHeight) + 'px';
		closeBtn.style.marginLeft = (videoStream.style.marginLeft - closeBtn.offsetWidth) + 'px';

	}


	static positionDivs() {


		let overlayDiv = document.querySelector('#takePicOverlay');
		let closeBtn = document.querySelector('#takePicClose');
		let videoStream = document.querySelector('#videoStream');
		let vidRect = videoStream.getBoundingClientRect();
		let buttonsDiv = document.querySelector('#buttonsDiv');
		let videoContainer = document.querySelector('#videoContainer');
		let capturButton = document.querySelector('#captureButton');
		let optVideoSize = takePic.getOptimizedVideoSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, videoStream.videoWidth, videoStream.videoHeight);
		videoContainer.style = `height:${0.8 * overlayDiv.offsetHeight}px;width:${0.8 * overlayDiv.offsetWidth}px;top:${0.1 * overlayDiv.offsetHeight}px;left:${0.1 * overlayDiv.offsetWidth}px;`;
		videoStream.style = `height:${optVideoSize.height}px;width:${optVideoSize.width}px;margin-top:${((videoContainer.offsetHeight - videoStream.offsetHeight) / 2)}px`;
		buttonsDiv.style.marginTop = ((videoContainer.offsetHeight / 2) - capturButton.offsetHeight) + 'px';
		closeBtn.style.marginTop = (((videoContainer.offsetHeight - videoStream.offsetHeight) / 2) - closeBtn.offsetHeight) + 'px';
		closeBtn.style.marginLeft = (videoStream.style.marginLeft - closeBtn.offsetWidth) + 'px';

	}


	//css to apply filter to video
	applyFilter(filter) {
		let video = document.getElementById("videoStream");
		let overlayDiv = document.getElementById('takePicOverlay');
		let marginTop = video.style.marginTop;
		let marginBottom = video.style.marginBottom;
		let opacity = video.style.opacity;
		let optVideoSize = takePic.getOptimizedVideoSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, video.videoWidth, video.videoHeight)
		video.style = takePic.getFilterArrayObj(filter);
		video.style.width = optVideoSize.width + 'px';
		video.style.height = optVideoSize.height + 'px'
		video.style.marginTop = marginTop;
		video.style.marginBottom = marginBottom;
		video.style.opacity = opacity;
		video.setAttribute("data-filter", filter);
		//add remove active effect class
		document.getElementsByClassName('filterVideoStreamActive')[0].classList.remove("filterVideoStreamActive");
		document.getElementById(filter.replace("css", "takePic")).classList.add("filterVideoStreamActive");
	}

	//function to set radio button css properties
	static getFilterArrayObj(param) {

		if (param === "prop") {
			return ['None', 'EffectTwo', 'Multiple', "GrayScale", "Sepia", "Contrast", "Hue", "Tint", "UjW0L", 'InvertMultiple', "Invert", "Bcg", "Gcbhss"];
		} else {

			if (param !== undefined) {
				return {
					cssFilterNone: "-webkit-filter:none; filter:none;",
					cssFilterEffectTwo: "-webkit-filter: grayscale(1) contrast(2.90) brightness(2.32); filter: grayscale(1) contrast(2.90) brightness(2.32);",
					cssFilterMultiple: "-webkit-filter:saturate(1.5) contrast(1.5) hue-rotate(-15deg); filter:saturate(1.5) contrast(1.5) hue-rotate(-15deg);",
					cssFilterInvertMultiple: "-webkit-filter: brightness(0.7) saturate(150%) contrast(190%) hue-rotate(30deg); filter: brightness(0.7) saturate(150%) contrast(190%) hue-rotate(30deg);",
					cssFilterSepia: "-webkit-filter: sepia(1); filter: sepia(1);",
					cssFilterGrayScale: "-webkit-filter: grayscale(1); filter: grayscale(1);",
					cssFilterInvert: "-webkit-filter: invert(2.5); filter: invert(2.5);",
					cssFilterHue: "-webkit-filter: hue-rotate(175deg); filter: hue-rotate(175deg);",
					cssFilterTint: "-webkit-filter: sepia(1) hue-rotate(200deg); filter: sepia(1) hue-rotate(200deg);",
					cssFilterUjW0L: "-webkit-filter: contrast(1.4) saturate(1.8) sepia(.6); filter: contrast(1.4) saturate(1.8) sepia(.6);",
					cssFilterContrast: "-webkit-filter: contrast(3); filter: contrast(3);",
					cssFilterBcg: "-webkit-filter: brightness(1.26) contrast(1.53) grayscale(0.65); filter: brightness(1.26) contrast(1.53) grayscale(0.65);",
					cssFilterGcbhss: "-webkit-filter: grayscale(0.48) contrast(1.99) brightness(2.32) hue-rotate(-43deg) saturate(0.75) sepia(0.79); filter: grayscale(0.48) contrast(1.99) brightness(2.32) hue-rotate(-43deg) saturate(0.75) sepia(0.79);",
				}[param];
			}
		}


	}



	//funtion to sanitize css filter
	static sanitizeFilter(filter) {

		let cleanFilter = '';
		let filterArray = filter.replace(/;/g, "").replace(/-webkit-filter/g, "").replace(/filter/g, "").replace(/:/g, '').split(" ")

		for (var i = 0; i < (filterArray.length / 2); i++) {

			if (filterArray[i].length > 1) {

				cleanFilter += filterArray[i] + " ";
			}
		}
		return cleanFilter;
	}


	// function to optimize video site
	static getOptimizedVideoSize(screenWidth, screenHeight, videoActualWidth, videoActualHeight) {

		var videoScreenHeightRatio = 0,
			videoScreenWidthRatio = 0,
			optimizedVideoHeight = 0,
			optimizedVideoWidth = 0;
		var vidPercent = 0.7,
			marginPercent = 0.2;

		if ((videoActualWidth >= screenWidth) && (videoActualHeight >= screenHeight)) {
			if (videoActualWidth >= videoActualHeight) {
				if (videoActualWidth > videoActualHeight) {

					videoScreenWidthRatio = videoActualWidth / screenWidth;
					optimizedVideoWidth = (videoActualWidth / videoScreenWidthRatio) - (marginPercent * screenWidth);
					optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
					if (optimizedVideoHeight >= (vidPercent * screenHeight)) {
						videoScreenHeightRatio = screenHeight / videoActualHeight;
						optimizedVideoHeight = videoActualHeight * videoScreenHeightRatio - (marginPercent * screenHeight);
						optimizedVideoWidth = videoActualWidth * (optimizedVideoHeight / videoActualHeight);
					}
				} else {

					if (screenWidth > screenHeight) {
						optimizedVideoHeight = (vidPercent * screenHeight);
						optimizedVideoWidth = optimizedVideoHeight;

					} else if (screenHeight > screenWidth) {
						optimizedVideoWidth = (vidPercent * screenWidth);
						optimizedVideoHeight = optimizedVideoWidth;

					} else {
						videoScreenHeightRatio = screenHeight / videoActualHeight;
						optimizedVideoHeight = videoActualHeight * videoScreenHeightRatio - (marginPercent * screenHeight);
						optimizedVideoWidth = videoActualWidth * (optimizedVideoHeight / videoActualHeight);
					}
				}

			} else {
				videoScreenHeightRatio = videoActualHeight / screenHeight;
				optimizedVideoHeight = (videoActualHeight / videoScreenHeightRatio) - (marginPercent * screenHeight);
				optimizedVideoWidth = videoActualWidth * (optimizedVideoHeight / videoActualHeight);
			}

		} else if (videoActualWidth >= screenWidth && videoActualHeight < screenHeight) {
			videoScreenWidthRatio = screenWidth / videoActualWidth;
			optimizedVideoWidth = videoActualWidth * videoScreenWidthRatio - (marginPercent * screenWidth);
			optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
		} else if (videoActualHeight >= screenHeight && videoActualWidth < screenWidth) {
			videoScreenHeightRatio = screenHeight / videoActualHeight;
			optimizedVideoHeight = videoActualHeight * videoScreenHeightRatio - (marginPercent * screenHeight);
			optimizedVideoWidth = videoActualWidth * (optimizedVideoHeight / videoActualHeight);
			optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
		} else {
			var avilableVideoWidth = vidPercent * screenWidth;
			var avilableVideoHeight = vidPercent * screenHeight;
			if (videoActualWidth >= avilableVideoWidth && videoActualHeight >= avilableVideoHeight) {
				var videoAvilableWidthRatio = avilableVideoWidth / videoActualWidth;
				videoAvilableHeightRatio = avilableVideoHeight / videoActualHeight;
				optimizedVideoWidth = avilableVideoWidth * videoAvilableWidthRatio;
				optimizedVideoHeight = screenHeight * videoScreenHeightRatio;
			} else if (videoActualWidth >= avilableVideoWidth && videoActualHeight < avilableVideoHeight) {
				var videoAvilableWidthRatio = avilableVideoWidth / videoActualWidth;
				optimizedVideoWidth = videoActualWidth * videoAvilableWidthRatio;
				optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
			} else if (videoActualHeight >= avilableVideoHeight && videoActualWidth < avilableVideoWidth) {
				var videoAvilableHeightRatio = avilableVideoHeight / videoActualHeight;
				optimizedVideoHeight = videoActualHeight * videoAvilableHeightRatio;
				optimizedVideoWidth = videoActualWidth * (optimizedVideoHeight / videoActualHeight);
			} else {
				optimizedVideoWidth = videoActualWidth;
				optimizedVideoHeight = videoActualHeight;
			}
			optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
		}


		//at last check it optimized width is still large			
		if (optimizedVideoWidth > (vidPercent * screenWidth)) {
			optimizedVideoWidth = vidPercent * screenWidth;
			optimizedVideoHeight = videoActualHeight * (optimizedVideoWidth / videoActualWidth);
		}

		return {
			width: optimizedVideoWidth,
			height: optimizedVideoHeight
		};
	}


	//function to access all uploaded images
	static viewUploadedImages() {

		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", my_ajax_url, true);
		xhttp.responseType = "json";
		xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');

		xhttp.onload = function () {
			if (this.status >= 200 && this.status < 400) {

				if (this.response.length === 1) {


					alert(takePicMessage.no_image);

				}
				else {

					let oldImageAlbum = document.getElementById("hiddenImageAlbum");

					if (oldImageAlbum === null) {


						takePic.createImageAlbum(this.response);
					}
					else {
						oldImageAlbum.remove();
						takePic.createImageAlbum(this.response);
					}

				}
			} else {
				alert(this.response);
			}
		};

		xhttp.onerror = function () {

			alert(takePicMessage.connection_error);
		};

		xhttp.send("action=ajaxGetUploadedImages");

	}



	//function to create hidden image album based on ajax response
	static createImageAlbum(response) {

		var imgDir = response.dir;
		var imageAlbum = document.createElement('div');
		imageAlbum.id = "hiddenImageAlbum";
		imageAlbum.style.display = "none";
		imageAlbum.setAttribute("onmouseover", "new ctcOverlayViewer(this);");


		ctcOverlayViewer.objectToArray(response.images).map((x) => {

			if (x.indexOf(".png") !== -1) {

				let userImg = document.createElement('img');
				userImg.setAttribute('src', imgDir + '/' + x);
				imageAlbum.appendChild(userImg);

			}
			document.body.insertBefore(imageAlbum, document.body.firstChild);

			setTimeout(function () {

				var mouseOverEvent = new Event('mouseover');
				var clickEvent = new Event("click");


				var newHiddenAlbum = document.getElementById("hiddenImageAlbum");

				newHiddenAlbum.dispatchEvent(mouseOverEvent)

				setTimeout(newHiddenAlbum.getElementsByTagName("img")[0].dispatchEvent(clickEvent), 200);

			}, 500);

		});

	}



	//function to upload imge to server
	static deleteImage(fileName, imageNum) {

		if (confirm(takePicMessage.delete_confirm)) {

			var xhttp = new XMLHttpRequest();
			xhttp.open("POST", my_ajax_url, true);
			xhttp.responseType = "text";
			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');

			xhttp.onload = function () {
				if (this.status >= 200 && this.status < 400) {


					if (this.response === 'deleted') {

						alert(takePicMessage.delete_success);

						takePic.removeDeletedImage(imageNum);

						let imageToLoad = parseInt(imageNum) - 1;
						if (imageToLoad > -1) {
							setTimeout(ctcOverlayViewer.loadOverlayImages(imageToLoad), 100);
						}
						else {

							setTimeout(ctcOverlayViewer.loadOverlayImages(imageNum), 100);
						}
					}
					else {
						alert(takePicMessage.delete_failed);
					}

				} else {

					alert(this.response);
				}
			};

			xhttp.onerror = function () {

				alert(takePicMessage.connection_error);
			};

			xhttp.send("action=ajaxDeleteImage&image=" + fileName);
		}

	}


	//function to remove deleted images from document
	static removeDeletedImage(imageNum) {

		let hiddenAlbum = document.getElementById("hiddenImageAlbum");
		let deletedImage = hiddenAlbum.querySelectorAll('img[onclick="ctcOverlayViewer.loadOverlayImages(' + imageNum + ');"]')[0];

		deletedImage.parentNode.removeChild(deletedImage);

		var sideGallery = document.getElementById("ctcOverlayThumbGalleryContainerV");
		if (sideGallery !== null) {
			let deletedGalImage = sideGallery.getElementsByClassName("ctcOverlayThumbGalleryActiveV")[0];
			deletedGalImage.parentNode.removeChild(deletedGalImage);
			var allSideGalImg = ctcOverlayViewer.objectToArray(sideGallery.getElementsByTagName("span"));
		}


		//change onclick attribute of images
		let allAlbumImg = ctcOverlayViewer.objectToArray(hiddenAlbum.getElementsByTagName("img"));

		if (allAlbumImg.length > 0) {
			allAlbumImg.map((el, i) => {

				el.setAttribute("onclick", "ctcOverlayViewer.loadOverlayImages(" + i + ");");
				if (sideGallery !== null) {
					if (allAlbumImg.length === 1) {
						sideGallery.parentNode.removeChild(sideGallery);
					}
					else {
						allSideGalImg[i].setAttribute("onclick", "ctcOverlayViewer.loadOverlayImages(" + i + ");");
					}
				}

			});
		}

		else {

			ctcOverlayViewer.closeOverlay();

		}


	}


}