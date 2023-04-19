
console.warn(`RUNNING IN CHILD`)
if (window.top === window) {
	console.log("Não há nenhum pai window acima deste iframe.");
  } else {
	console.log("Existe um pai window acima deste iframe.");
  }

if(!window.top.document.querySelector("#streamshop-widget-script")) {
window.top.head = window.top.document.querySelector('head');
   
// cria um elemento <script>
window.top.scriptElement = window.top.document.createElement('script');

window.top.scriptElement.setAttribute("id", "streamshop-widget-script")

// define o código JavaScript dentro da tag <script>
window.top.scriptElement.innerHTML = `
// Custom Options (how to use: https://streamshop.readme.io/reference/setup)
		 var streamShopOptions = null;

		 // Core Script  (do not touch)
		 (function (i, s, o, g, r, a, m) {
			 var p = new Promise((rs) => rs());
			 (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
			 a.async = 1;
			 a.src = g;
			 a.onload = () => p.then(() => ss(streamShopOptions));
			 m.parentNode.insertBefore(a, m);
		 })(window, document, 'script', 'https://assets.streamshop.com.br/widget/streamshop-script.min.js');`;

// adiciona a tag <script> ao DOM (no final do elemento <head>)
   window.top.head.appendChild(window.top.scriptElement);
}

var ss = (function () {
	// SETTINGS
	var btn, liveContainer, liveContainerCloseBtn, iframe, options;

	function registerGlobalIframeEvent() {
		window.addEventListener('message', function (event) {
			if (typeof event.data !== 'string') return;

			const data = JSON.parse(event.data);

			if (typeof data !== 'object') {
				console.warn(
					'\n\n[ STREAMSHOP WARNING ]:\nDado recebido não é um object',
					data
				);
				return;
			}

			if (data?.from === 'STREAMSHOP' && data?.url)
				window.top.openStreamShopLive(data.url);
			else
				console.warn(
					'\n\n[ STREAMSHOP WARNING ]:\nVocê não importou o script do StreamShop Widget corretamente\nPor favor consultar documentação: https://streamshop.readme.io/reference/streamshop-widget\n\n'
				);
		});
	}

	function start(streamShopOptions) {
		createElements();
		setIframeAtributes();
		setLiveContainerAtributes();
		setLiveContainerCloseBtnAtributes();
		registerGlobalIframeEvent();

		if (streamShopOptions?.live) {
			options = {
				height: 70,
				width: 70,
				positionX: 'right',
				spacingPositionX: 30,
				positionY: 'bottom',
				spacingPositionY: 30,
				borderRadius: 50,
				animation: true,
				showWidgetBtn: true,
				bg: placeholderBg,
				onHover: {
					enable: true,
					borderRadius: 15,
				},

				...streamShopOptions,
			};

			createBtnStyles();
			setBtnAtributes();
		}
	}

	// CORE
	function addButtonWidgetOnScreen() {
		document.body.appendChild(btn);
	}

	function createElements() {
		btn = document.createElement('button');
		liveContainer = document.createElement('div');
		liveContainerCloseBtn = document.createElement('div');
		iframe = document.createElement('iframe');
	}

	// IFRAME CONTROL
	function showIframe(liveUrl, resolveRef) {
		iframe.setAttribute('src', liveUrl);
		liveContainer.appendChild(iframe);
		liveContainer.appendChild(liveContainerCloseBtn);
		liveContainerCloseBtn.addEventListener('click', resolveRef);
		document.body.appendChild(liveContainer);

		setTimeout(() => {
			liveContainer.style.opacity = '1';
			liveContainerCloseBtn.style.opacity = '1';
			liveContainer.style.bottom = '0px';
			liveContainer.style.background = '#0000008a';
		}, 500);
	}

	function removeIframe() {
		resetStyles();
		setTimeout(() => {
			liveContainer.remove();
			liveContainerCloseBtn.remove();
		}, 500);
	}

	function resetStyles() {
		liveContainer.style.opacity = '0';
		liveContainerCloseBtn.style.opacity = '0';
		liveContainer.style.bottom = '-50vh';
		liveContainer.style.background = '#ff000000';
	}

	// ATRIBUTOS
	function setIframeAtributes() {
		iframe.setAttribute(
			'allow',
			'microphone; camera; fullscreen; autoplay; picture-in-picture'
		);
		iframe.setAttribute('allowtransparency', 'true');
		iframe.setAttribute('frameBorder', '0');
		iframe.setAttribute('marginheight', '0');
		iframe.setAttribute('marginwidth', '0');
		iframe.setAttribute('width', '100%');
		iframe.setAttribute('height', '97%');
		iframe.setAttribute('scrolling', 'auto');
		iframe.setAttribute('src', '');
		iframe.style.background = 'black';
	}

	function setBtnAtributes() {
		// Add class
		btn.classList.add('ss-button-widget');

		if (options?.onHover && options?.onHover?.enable === true) {
			btn.classList.add('-hover');
		}

		Object.assign(btn.style, {
			position: 'fixed',
			[options?.positionY === 'bottom'
				? 'bottom'
				: 'top']: `${options?.spacingPositionY}px`,
			[options?.positionX === 'left'
				? 'left'
				: 'right']: `${options?.spacingPositionX}px`,
			zIndex: '1000',
			borderRadius: `${options?.borderRadius}px`,
			height: `${options?.height}px`,
			width: `${options?.width}px`,
			border: '0px',
			cursor: 'pointer',
			boxShadow: '0 0 0 0 rgba(0, 0, 0, 1)',
			transition: '1s ease-in-out',
			transform: 'scale(1)',
			color: 'white',
			fontSize: '13px',
		});

		if (options?.animation === true)
			btn.style.animation = 'streamshopPulseAn 2s infinite';

		if (options?.video && options?.video.enable === true) {
			// Display
			btn.style.display = 'flex';
			btn.style.alignItems = 'center';
			btn.style.justifyContent = 'center';
			btn.style.overflow = 'hidden';

			var video = document.createElement('video');

			video.setAttribute('muted', 'true');
			video.setAttribute('autoplay', 'true');
			video.setAttribute('loop', 'true');
			video.removeAttribute('controls');
			video.src = options?.video.url;
			video.muted = true;
			video.autoplay = true;

			video.style.height = '100%';

			btn.appendChild(video);

			video.addEventListener(
				'loadeddata',
				() => addButtonWidgetOnScreen(),
				false
			);
		} else {
			addButtonWidgetOnScreen();
			btn.style.background = `url(${options.bg})`;
			btn.style.backgroundPosition = 'center';
			btn.style.backgroundSize = 'cover';
		}

		btn.addEventListener('click', () =>
			new Promise((resolve) => showIframe(options.live, resolve)).then(() => {
				options.afterClose
					? options.afterClose()
					: console.warn(
							'\n\n[ STREAMSHOP WARNING ]:\nVocê não implementou um método de afterClose\nCaso queira, consultar documentação: https://streamshop.readme.io/reference/streamshop-widget\n\n'
					  );
			})
		);
	}

	function setLiveContainerCloseBtnAtributes() {
		Object.assign(liveContainerCloseBtn.style, {
			cursor: 'pointer',
			position: 'absolute',
			opacity: 0,
			transition: '.5s',
			position: 'fixed',
			fill: 'white',
			top: '7px',
			right: 'calc(50% - 25px)',
			borderRadius: '50%',
			height: '40px',
			width: '40px',
			background: '#00000061',
			outline: '2px solid #00000024',
		});

		liveContainerCloseBtn.innerHTML = `<svg style="width: 100%; height: 100%" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm-18.005-1.568l1.415-1.414 4.59 4.574 4.579-4.574 1.416 1.414-5.995 5.988-6.005-5.988z"/></svg>`;
	}

	function setLiveContainerAtributes() {
		Object.assign(liveContainer.style, {
			position: 'fixed',
			bottom: '-50vw',
			width: '100%',
			height: '-webkit-fill-available',
			zIndex: 1001,
			background: '#ff000000',
			opacity: 0,
			transition: 'bottom .5s, opacity .5s, background 5s',
			display: 'flex',
			alignItems: 'flex-end',
		});

		liveContainerCloseBtn.addEventListener('click', function () {
			liveContainer.style.bottom = '-50vw';
			liveContainer.style.opacity = '0';
			liveContainerCloseBtn.style.opacity = '0';

			setTimeout(() => removeIframe(), 500);
		});
	}

	// STYLES
	function createBtnStyles() {
		var style = document.createElement('style');

		style.append(`
        ${
					options?.onHover && options?.onHover?.enable
						? `
            @media (min-width: 600px){
                .ss-button-widget.-hover:hover{
                    height: ${
											options?.onHover?.height || options?.height * 2
										}px !important;
                    width: ${
											options?.onHover?.width || options?.width * 1.5
										}px !important;
                    border-radius: ${
											options?.onHover?.borderRadius === 0
												? 0
												: options?.onHover?.borderRadius
										}px !important;
                }
            }`
						: ``
				}

            @keyframes streamshopPulseAn {
                0% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
                }
                70% {
                    transform: scale(1);
                    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
                }
                100% {
                    transform: scale(0.95);
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
                }
            }`);

		document.body.appendChild(style);
	}

	window['openStreamShopLive'] = (liveUrl) =>
		new Promise((resolve) => showIframe(liveUrl, resolve));

	var placeholderBg =
		'data:image/png;base64,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';

	return start;
})(window);
