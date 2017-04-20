"use strict";
if (typeof(seatsio) == "undefined") {
	(function () {
		var a = {};
		a.onLoad = function (j) {
			j()
		};
		a.charts = [];
		a.CHART_ID = 0;
		a.baseUrl = "https://app.seats.io";
		a.getChart = function (k) {
			for (var j = 0; j < this.charts.length; ++j) {
				if (this.charts[j].chartId == k) {
					return this.charts[j]
				}
			}
		};
		a.destroyCharts = function () {
			a.charts.forEach(function (j) {
				j.destroy()
			})
		};

		function b(j, k) {
			if (window.addEventListener) {
				window.addEventListener(j, k)
			} else {
				window.attachEvent("on" + j, k)
			}
		}
		function g() {
			var j = document.createElement("link");
			j.href = a.baseUrl + "/public/stylesheets/spinner.css";
			j.type = "text/css";
			j.rel = "stylesheet";
			document.getElementsByTagName("head")[0].appendChild(j)
		}
		function f() {
			return typeof define == "function" && typeof define.amd == "object" && define.amd
		}
		if (f()) {
			define([], function () {
				return a
			})
		} else {
			window.seatsio = a
		}
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (m, n) {
				for (var l = (n || 0), k = this.length; l < k; l++) {
					if (this[l] === m) {
						return l
					}
				}
				return -1
			}
		}
		a.removeFromArray = function (l, k) {
			var j = k.indexOf(l);
			if (j > -1) {
				k.splice(j, 1)
			}
		};

		function d(j) {
			this.val = j
		}
		d.prototype.orElse = function (j) {
			if (typeof(this.val) == "undefined" || this.val == null) {
				return j
			}
			return this.val
		};

		function h(j) {
			return new d(j)
		}
		function c(l) {
			l = l || window.event;
			if (l.origin != a.baseUrl) {
				return
			}
			var j = JSON.parse(l.data);
			var k = a.getChart(j.chartId);
			if (!k) {
				return
			}
			if (k.messageHandlers[j.type]) {
				k.messageHandlers[j.type](l, k, j)
			}
		}
		function e(k) {
			for (var j = 0; j < a.charts.length; ++j) {
				a.charts[j].handleKey(k)
			}
		}
		a.warn = function (j) {
			if (typeof console != "undefined") {
				console.warn(j)
			}
		};
		a.Element = function (j) {
			this.element = j
		};
		a.Element.prototype.getContentHeight = function () {
			var k = getComputedStyle(this.element);
			var j = a.Element.pixelsToNumber(k.height);
			if (k["box-sizing"] === "border-box") {
				return j - a.Element.verticalPaddingAndBorder(k)
			}
			return j
		};
		a.Element.prototype.getContentWidth = function () {
			var j = getComputedStyle(this.element);
			var k = a.Element.pixelsToNumber(j.width);
			if (j["box-sizing"] === "border-box") {
				return k - a.Element.horizontalPaddingAndBorder(j)
			}
			return k
		};
		a.Element.pixelsToNumber = function (j) {
			if (j === "auto") {
				return 0
			}
			return parseFloat(j)
		};
		a.Element.horizontalPaddingAndBorder = function (k) {
			var j = a.Element.pixelsToNumber(k["border-left-width"]);
			var m = a.Element.pixelsToNumber(k["border-right-width"]);
			var l = a.Element.pixelsToNumber(k["padding-left"]);
			var n = a.Element.pixelsToNumber(k["padding-right"]);
			return j + m + l + n
		};
		a.Element.verticalPaddingAndBorder = function (j) {
			var n = a.Element.pixelsToNumber(j["border-top-width"]);
			var k = a.Element.pixelsToNumber(j["border-bottom-width"]);
			var l = a.Element.pixelsToNumber(j["padding-top"]);
			var m = a.Element.pixelsToNumber(j["padding-bottom"]);
			return n + k + l + m
		};
		a.ResizeListener = function () {
			this.elementFetcher = null;
			this.widthChangedListener = null;
			this.dimensionsChangedListener = null;
			this.currentDimensions = null;
			this.stopRequested = false
		};
		a.ResizeListener.prototype.withElementFetcher = function (j) {
			this.elementFetcher = j;
			return this
		};
		a.ResizeListener.prototype.onInitialDimensionsDetermined = function (j) {
			this.initialDimensionsDeterminedListener = j;
			return this
		};
		a.ResizeListener.prototype.onWidthChanged = function (j) {
			this.widthChangedListener = j;
			return this
		};
		a.ResizeListener.prototype.onDimensionsChanged = function (j) {
			this.dimensionsChangedListener = j;
			return this
		};
		a.ResizeListener.prototype.start = function () {
			this.listenForResizes();
			return this
		};
		a.ResizeListener.prototype.stop = function () {
			this.stopRequested = true;
			return this
		};
		a.ResizeListener.prototype.listenForResizes = function () {
			if (this.shouldStop()) {
				return
			}
			if (this.currentDimensions === null) {
				this.currentDimensions = this.determineInitialDimensions()
			} else {
				this.invokeListenerWhenResized()
			}
			this.relistenForResizes()
		};
		a.ResizeListener.prototype.relistenForResizes = function () {
			setTimeout(function () {
				this.listenForResizes()
			}.bind(this), 50)
		};
		a.ResizeListener.prototype.determineInitialDimensions = function () {
			var j = this.elementDimensions();
			if (j.width === 0 && j.height === 0) {
				return null
			}
			if (this.initialDimensionsDeterminedListener) {
				this.initialDimensionsDeterminedListener(j.width, j.height)
			}
			return j
		};
		a.ResizeListener.prototype.shouldStop = function () {
			var j = this.elementFetcher();
			return !j || this.stopRequested
		};
		a.ResizeListener.prototype.invokeListenerWhenResized = function () {
			var j = this.elementDimensions();
			this.checkForWidthChanges(j);
			this.checkForDimensionChanges(j);
			this.currentDimensions = j
		};
		a.ResizeListener.prototype.resetCurrentDimensions = function () {
			var j = this.elementDimensions();
			this.currentDimensions = j
		};
		a.ResizeListener.prototype.checkForWidthChanges = function (j) {
			if (j.width !== this.currentDimensions.width) {
				if (this.widthChangedListener) {
					this.widthChangedListener(j.width)
				}
			}
		};
		a.ResizeListener.prototype.checkForDimensionChanges = function (j) {
			if (j.width !== this.currentDimensions.width || j.height !== this.currentDimensions.height) {
				if (this.dimensionsChangedListener) {
					this.dimensionsChangedListener(j.width, j.height)
				}
			}
		};
		a.ResizeListener.prototype.elementDimensions = function () {
			var j = new a.Element(this.elementFetcher());
			return {
				width: j.getContentWidth(),
				height: j.getContentHeight()
			}
		};
		a.SeatingChartConfigValidator = function (j) {
			this.config = j
		};
		a.SeatingChartConfigValidator.prototype.validate = function () {
			if (this.config.fitTo) {
				if (this.config.fitTo !== "width" && this.config.fitTo !== "widthAndHeight") {
					a.SeatingChartConfigValidator.error("fitTo should be either width or widthAndHeight")
				}
			}
		};
		a.SeatingChartConfigValidator.error = function (j) {
			throw new Error("Invalid seats.io config: " + j)
		};
		a.Embeddable = function () {};
		a.Embeddable.prototype.init = function (j) {
			this.validateConfig(j);
			if (!j) {
				j = {}
			}
			if (!j.divId) {
				j.divId = "chart"
			}
			if (!j.loading) {
				j.loading = '<div class="spinner-loader"></div>'
			}
			this.config = j;
			this.iframe = null
		};
		a.Embeddable.prototype.validateConfig = function (j) {};
		a.Embeddable.prototype.container = function () {
			return document.getElementById(this.config.divId)
		};
		a.Embeddable.prototype.createIframe = function (j) {
			this.iframe = document.createElement("iframe");
			this.iframe.style.border = "none";
			this.iframe.scrolling = "no";
			this.iframe.frameBorder = 0;
			this.iframe.src = j;
			this.iframe.style.width = "100%";
			this.iframe.style.height = "100%";
			this.iframe.style.display = "block";
			this.iframe.style.visibility = "hidden";
			this.container().appendChild(this.iframe)
		};
		a.Embeddable.prototype.removeIframe = function () {
			if (this.iframe) {
				this.container().removeChild(this.iframe);
				this.iframe = null
			}
		};
		a.Embeddable.prototype.createLoadingDiv = function () {
			this.loadingDiv = document.createElement("div");
			this.loadingDiv.style.textAlign = "center";
			this.loadingDiv.style.padding = "20px 0";
			this.loadingDiv.innerHTML = this.config.loading;
			this.container().appendChild(this.loadingDiv)
		};
		a.Embeddable.prototype.removeLoadingDiv = function () {
			if (this.loadingDiv) {
				this.container().removeChild(this.loadingDiv);
				this.loadingDiv = null
			}
		};
		a.Embeddable.prototype.sendMsgToIframe = function (j) {
			j.chartId = this.chartId;
			this.iframe.contentWindow.postMessage(JSON.stringify(j), "*")
		};
		var i = {
			SHIFT: 16
		};
		a.Embeddable.prototype.handleKey = function (j) {
			if (j.keyCode === i.SHIFT) {
				this.sendMsgToIframe({
					type: j.type,
					keyCode: j.keyCode
				})
			}
		};
		a.SeatingChart = function (j) {
			a.charts.push(this);
			this.chartId = a.CHART_ID++;
			this.init(j);
			this.selectedObjectsInput = null;
			this.storage = a.SeatsioStorage.create(this.chartId);
			this.config.maxSelectedObjects = h(this.config.maxSelectedObjects).orElse(this.config.maxSelectedSeats);
			this.config.objectColor = h(this.config.objectColor).orElse(this.config.seatColor);
			this.config.objectLabel = h(this.config.objectLabel).orElse(this.config.seatLabel);
			this.config.objectIcon = h(this.config.objectIcon).orElse(this.config.seatIcon);
			this.config.sectionColor = this.config.sectionColor;
			this.config.selectedObjectsInputName = h(this.config.selectedObjectsInputName).orElse(this.config.selectedSeatsInputName);
			this.config.selectedObjects = h(this.config.selectedObjects).orElse(this.config.selectedSeats);
			this.config.onObjectSelected = h(this.config.onObjectSelected).orElse(this.config.onSeatSelected);
			this.config.onObjectDeselected = h(this.config.onObjectDeselected).orElse(this.config.onSeatDeselected);
			this.config.onObjectMouseOver = h(this.config.onObjectMouseOver).orElse(this.config.onSeatMouseOver);
			this.config.onObjectMouseOut = h(this.config.onObjectMouseOut).orElse(this.config.onSeatMouseOut);
			this.config.onSelectedObjectBooked = h(this.config.onSelectedObjectBooked).orElse(this.config.onSelectedSeatBooked);
			this.config.onBestAvailableSelected = h(this.config.onBestAvailableSelected).orElse(this.config.onBestAvailableSeatsSelected);
			this.config.onBestAvailableSelectionFailed = h(this.config.onBestAvailableSelectionFailed).orElse(this.config.onBestAvailableSeatsSelectionFailed);
			if (this.config.reserveOnSelect && !this.config.regenerateReservationToken) {
				this.config.reservationToken = h(this.config.reservationToken).orElse(this.fetchStoredReservationToken())
			}
			this.selectedObjects = this.selectedSeats = [];
			this.reservationToken = null;
			this.requestIdCtr = 0;
			this.requestCallbacks = {};
			this.requestErrorCallbacks = {};
			this.isRendered = false;
			this.isDestroyed = false;
			this.initialContainerDimensions = null;
			this.resizeListener = new a.ResizeListener()
		};
		a.SeatingChart.prototype = new a.Embeddable();
		a.SeatingChart.prototype.render = function () {
			if (this.isDestroyed) {
				throw new Error("Cannot render a chart that has been destroyed")
			}
			var j = this;
			this.resizeListener.withElementFetcher(function () {
				return j.container()
			}).onInitialDimensionsDetermined(function (l, k) {
				j.renderChartInitially(l, k)
			}).onWidthChanged(function (k) {
				if (j.fitsToWidth()) {
					j.renderChart(k)
				}
			}).onDimensionsChanged(function (l, k) {
				if (j.fitsToWidthAndHeight()) {
					j.renderChart(l, k)
				}
			}).start();
			return this
		};
		a.SeatingChart.prototype.destroy = function () {
			if (this.isDestroyed) {
				throw new Error("Cannot destroy a chart that has already been destroyed")
			}
			this.resizeListener.stop();
			this.removeIframe();
			this.removeLoadingDiv();
			this.removeSelectedObjectsInput();
			this.removeReservationTokenInput();
			a.removeFromArray(this, a.charts);
			this.isRendered = false;
			this.isDestroyed = true
		};
		a.SeatingChart.prototype.renderChartInitially = function (k, j) {
			this.initialContainerDimensions = {
				width: k,
				height: j
			};
			this.createLoadingDiv();
			this.positionLoadingDivAbsolutelyToFixContainerDivMinHeightIssueOnIOS(k);
			this.createIframe(a.baseUrl + "/chartRendererIframe.html?chartId=" + this.chartId);
			this.createSelectedObjectsInput();
			this.createReservationTokenInput()
		};
		a.SeatingChart.prototype.positionLoadingDivAbsolutelyToFixContainerDivMinHeightIssueOnIOS = function (j) {
			this.loadingDiv.style.position = "absolute";
			this.loadingDiv.style.width = j + "px"
		};
		a.SeatingChart.prototype.renderChart = function (k, j) {
			if (this.fitsToWidth() && k) {
				this.sendMsgToIframe({
					type: "render",
					dimensions: {
						width: k
					}
				})
			} else {
				if (this.fitsToWidthAndHeight() && k && j) {
					this.sendMsgToIframe({
						type: "render",
						dimensions: {
							width: k,
							height: j
						}
					})
				}
			}
		};
		a.SeatingChart.prototype.validateConfig = function (j) {
			new a.SeatingChartConfigValidator(j).validate()
		};
		a.SeatingChart.prototype.fitsToWidth = function () {
			return this.determineFitTo() === "width"
		};
		a.SeatingChart.prototype.fitsToWidthAndHeight = function () {
			return this.determineFitTo() === "widthAndHeight"
		};
		a.SeatingChart.prototype.determineFitTo = function () {
			if (this.config.fitTo) {
				return this.config.fitTo
			}
			if (this.initialContainerDimensions.width && this.initialContainerDimensions.height) {
				return "widthAndHeight"
			}
			return "width"
		};
		a.SeatingChart.prototype.configured = function () {
			this.renderChart(this.resizeListener.currentDimensions.width, this.resizeListener.currentDimensions.height)
		};
		a.SeatingChart.prototype.rendered = function (k, j) {
			this.iframe.style.visibility = "visible";
			this.resized(k, j);
			this.loadingDiv.style.display = "none";
			this.isRendered = true;
			if (this.config.onChartRendered) {
				this.config.onChartRendered(this)
			}
			if (typeof window.callPhantom === "function") {
				window.callPhantom("chartRendered")
			}
		};
		a.SeatingChart.prototype.rerendered = function (k, j) {
			this.resized(k, j);
			if (this.config.onChartRerendered) {
				this.config.onChartRerendered(this)
			}
		};
		a.SeatingChart.prototype.resized = function (k, j) {
			this.iframe.style.width = k + "px";
			this.iframe.style.height = j + "px";
			this.resizeListener.resetCurrentDimensions()
		};
		a.SeatingChart.prototype.createSelectedObjectsInput = function () {
			if (!this.config.selectedObjectsInputName) {
				return
			}
			this.selectedObjectsInput = document.createElement("input");
			this.selectedObjectsInput.type = "hidden";
			this.selectedObjectsInput.name = this.config.selectedObjectsInputName;
			this.container().appendChild(this.selectedObjectsInput)
		};
		a.SeatingChart.prototype.removeSelectedObjectsInput = function () {
			if (this.selectedObjectsInput) {
				this.container().removeChild(this.selectedObjectsInput);
				this.selectedObjectsInput = null
			}
		};
		a.SeatingChart.prototype.createReservationTokenInput = function () {
			if (!this.config.reservationTokenInputName) {
				return
			}
			this.reservationTokenInput = document.createElement("input");
			this.reservationTokenInput.type = "hidden";
			this.reservationTokenInput.name = this.config.reservationTokenInputName;
			this.container().appendChild(this.reservationTokenInput)
		};
		a.SeatingChart.prototype.removeReservationTokenInput = function () {
			if (this.reservationTokenInput) {
				this.container().removeChild(this.reservationTokenInput);
				this.reservationTokenInput = null
			}
		};
		a.SeatingChart.prototype.updateSelectedObjectsInputValue = function () {
			if (this.selectedObjectsInput) {
				this.selectedObjectsInput.value = this.selectedObjects
			}
		};
		a.SeatingChart.prototype.objectSelected = function (j) {
			this.selectedObjects.push(this.uuidOrLabel(j));
			this.updateSelectedObjectsInputValue()
		};
		a.SeatingChart.prototype.objectDeselected = function (j) {
			for (var k = 0; k < this.selectedObjects.length; ++k) {
				if (this.uuidOrLabel(j) == this.selectedObjects[k]) {
					this.selectedObjects.splice(k, 1);
					break
				}
			}
			this.updateSelectedObjectsInputValue()
		};
		a.SeatingChart.prototype.setReservationToken = function (j) {
			this.reservationToken = j;
			this.storage.store("reservationToken", j);
			if (this.reservationTokenInput) {
				this.reservationTokenInput.value = j
			}
		};
		a.SeatingChart.prototype.fetchStoredReservationToken = function () {
			return this.storage.fetch("reservationToken")
		};
		a.SeatingChart.prototype.formatPrices = function (j) {
			var k = {};
			j.forEach(function (l) {
				k[l] = this.config.priceFormatter(l)
			}.bind(this));
			return k
		};
		a.SeatingChart.prototype.uuidOrLabel = function (j) {
			if (this.config.useObjectUuidsInsteadOfLabels) {
				return j.uuid
			}
			return j.label
		};
		a.SeatingChart.prototype.selectBestAvailable = function (j) {
			this.sendMsgToIframe({
				type: "selectBestAvailable",
				bestAvailableConfig: j
			})
		};
		a.SeatingChart.prototype.setUnavailableCategories = function (j) {
			this.sendMsgToIframe({
				type: "setUnavailableCategories",
				unavailableCategories: j
			})
		};
		a.SeatingChart.prototype.changeConfig = function (j) {
			this.sendMsgToIframe({
				type: "changeConfig",
				config: a.SeatingChart.serializeConfig(j)
			})
		};
		a.SeatingChart.prototype.clearSelection = function () {
			this.sendMsgToIframe({
				type: "clearSelection"
			})
		};
		a.SeatingChart.prototype.findObject = function (k, l, j) {
			this.sendMsgToIframe({
				type: "findObject",
				requestId: ++this.requestIdCtr,
				objectUuidOrLabel: k
			});
			this.requestCallbacks[this.requestIdCtr] = l;
			this.requestErrorCallbacks[this.requestIdCtr] = j
		};
		a.SeatingChart.prototype.selectObjects = a.SeatingChart.prototype.selectSeats = function (j) {
			this.sendMsgToIframe({
				type: "selectObjects",
				objectUuidsOrLabels: j
			})
		};
		a.SeatingChart.prototype.deselectObjects = a.SeatingChart.prototype.deselectSeats = function (j) {
			this.sendMsgToIframe({
				type: "deselectObjects",
				objectUuidsOrLabels: j
			})
		};
		a.SeatingChart.prototype.selectCategories = function (j) {
			this.sendMsgToIframe({
				type: "selectCategories",
				ids: j
			})
		};
		a.SeatingChart.prototype.highlightObjects = function (j) {
			this.sendMsgToIframe({
				type: "highlightObjects",
				objectUuidsOrLabels: j
			})
		};
		a.SeatingChart.prototype.unhighlightObjects = function (j) {
			this.sendMsgToIframe({
				type: "unhighlightObjects",
				objectUuidsOrLabels: j
			})
		};
		a.SeatingChart.prototype.objectFound = function (k, j) {
			if (!this.requestCallbacks[k]) {
				return
			}
			this.requestCallbacks[k](j);
			this.requestCallbacks[k] = undefined
		};
		a.SeatingChart.prototype.objectNotFound = function (j) {
			if (!this.requestErrorCallbacks[j]) {
				return
			}
			this.requestErrorCallbacks[j]();
			this.requestErrorCallbacks[j] = undefined
		};
		a.SeatingChart.serializeConfig = function (j) {
			if (j.tooltipText) {
				j.customTooltipText = true
			}
			if (j.onBestAvailableSelected) {
				j.onBestAvailableSelectedCallbackImplemented = true
			}
			if (j.onBestAvailableSelectionFailed) {
				j.onBestAvailableSelectionFailedCallbackImplemented = true
			}
			if (j.objectColor) {
				j.objectColor = j.objectColor.toString()
			}
			if (j.sectionColor) {
				j.sectionColor = j.sectionColor.toString()
			}
			if (j.objectLabel) {
				j.objectLabel = j.objectLabel.toString()
			}
			if (j.objectIcon) {
				j.objectIcon = j.objectIcon.toString()
			}
			if (j.priceFormatter) {
				j.priceFormatterUsed = true
			}
			if (j.isObjectSelectable) {
				j.isObjectSelectable = j.isObjectSelectable.toString()
			}
			if (j.isObjectVisible) {
				j.isObjectVisible = j.isObjectVisible.toString()
			}
			if (j.objectCategory) {
				j.objectCategory = j.objectCategory.toString()
			}
			if (j.onObjectStatusChanged) {
				j.onObjectStatusChangedCallbackImplemented = true
			}
			return j
		};
		a.SeatingChart.enrichObjectDomain = function (k, j) {
			if (j.objectType !== "section") {
				j.select = function () {
					k.selectObjects([k.uuidOrLabel(j)])
				};
				j.deselect = function () {
					k.deselectObjects([k.uuidOrLabel(j)])
				};
				j.highlight = function () {
					k.highlightObjects([k.uuidOrLabel(j)])
				};
				j.unhighlight = function () {
					k.unhighlightObjects([k.uuidOrLabel(j)])
				};
				j.seatId = j.id
			}
			j.chart = k;
			return j
		};
		a.SeatingChart.prototype.messageHandlers = {
			seatsioLoaded: function (m, k, l) {
				var j = a.SeatingChart.serializeConfig(k.config);
				k.sendMsgToIframe({
					type: "configure",
					configuration: j
				})
			},
			configured: function (l, j, k) {
				j.configured()
			},
			onChartRendered: function (l, j, k) {
				j.rendered(k.width, k.height)
			},
			onChartRerendered: function (l, j, k) {
				j.rerendered(k.width, k.height)
			},
			bookableObjectEvent: function (l, j, k) {
				a.SeatingChart.enrichObjectDomain(j, k.object);
				if (k.subtype == "onObjectSelected") {
					j.objectSelected(k.object, k.priceLevel)
				} else {
					if (k.subtype == "onObjectDeselected") {
						j.objectDeselected(k.object, k.priceLevel)
					} else {
						if (k.subtype == "onObjectStatusChanged") {
							if (!j.isRendered) {
								return
							}
						}
					}
				}
				if (j.config[k.subtype]) {
					j.config[k.subtype](k.object, k.priceLevel)
				}
			},
			dragStarted: function (k, j) {
				j.smoothener = new a.iOSScrollSmoothener()
			},
			dragScrollOutOfBounds: function (l, j, k) {
				var m = j.smoothener.smoothen(k.amount);
				if (j.config.onScrolledOutOfBoundsVertically) {
					j.config.onScrolledOutOfBoundsVertically(m)
				} else {
					window.scrollBy(0, m)
				}
			},
			reservationTokenChanged: function (l, j, k) {
				j.setReservationToken(k.token)
			},
			tooltipTextRequested: function (l, j, k) {
				a.SeatingChart.enrichObjectDomain(j, k.object);
				j.sendMsgToIframe({
					type: "tooltipTextGenerated",
					text: j.config.tooltipText(k.object)
				})
			},
			onBestAvailableSelected: function (l, j, k) {
				if (j.config.onBestAvailableSelected) {
					j.config.onBestAvailableSelected(k.seats.map(function (m) {
						return a.SeatingChart.enrichObjectDomain(j, m)
					}))
				}
			},
			onBestAvailableSelectionFailed: function (l, j, k) {
				if (j.config.onBestAvailableSelectionFailed) {
					j.config.onBestAvailableSelectionFailed()
				}
			},
			priceFormattingRequested: function (l, j, k) {
				j.sendMsgToIframe(({
					type: "pricesFormatted",
					formattedPrices: j.formatPrices(k.prices)
				}))
			},
			objectFound: function (l, j, k) {
				a.SeatingChart.enrichObjectDomain(j, k.object);
				j.objectFound(k.requestId, k.object)
			},
			objectNotFound: function (l, j, k) {
				j.objectNotFound(k.requestId)
			}
		};
		a.iOSScrollSmoothener = function () {
			this.previousScrollAmount = 0
		};
		a.iOSScrollSmoothener.prototype.smoothen = function (j) {
			if (a.iOSScrollSmoothener.differentSigns(j, this.previousScrollAmount)) {
				this.previousScrollAmount = j;
				return 0
			}
			this.previousScrollAmount = j;
			return j
		};
		a.iOSScrollSmoothener.differentSigns = function (k, j) {
			return k < 0 && j > 0 || k > 0 && j < 0
		};
		a.SeatingChartDesigner = function (j) {
			a.charts.push(this);
			this.chartId = a.CHART_ID++;
			this.init(j);
			this.isRendered = false
		};
		a.SeatingChartDesigner.prototype = new a.Embeddable();
		a.SeatingChartDesigner.prototype.render = function (j) {
			this.renderedCallback = j;
			this.createLoadingDiv();
			this.createIframe(a.baseUrl + "/chartDesignerIframe.html?chartId=" + this.chartId);
			this.iframe.scrolling = "yes";
			return this
		};
		a.SeatingChartDesigner.prototype.rerender = function () {
			this.isRendered = false;
			this.iframe.remove();
			this.render()
		};
		a.SeatingChartDesigner.prototype.serializeConfig = function () {
			var j = JSON.parse(JSON.stringify(this.config));
			if (this.config.onExitRequested) {
				j.showExitButton = true
			}
			return j
		};
		a.SeatingChartDesigner.prototype.messageHandlers = {
			seatsioLoaded: function (k, j) {
				j.sendMsgToIframe({
					type: "render",
					configuration: j.serializeConfig()
				})
			},
			seatsioRendered: function (k, j) {
				j.loadingDiv.remove();
				j.iframe.style.visibility = "visible";
				if (j.renderedCallback) {
					j.renderedCallback()
				}
				if (j.config.onDesignerRendered) {
					j.config.onDesignerRendered(this)
				}
				j.isRendered = true
			},
			chartCreated: function (l, j, k) {
				j.config.chartKey = k.data;
				if (j.config.onChartCreated) {
					j.config.onChartCreated(k.data)
				}
			},
			chartUpdated: function (k, j) {
				if (j.config.onChartUpdated) {
					j.config.onChartUpdated(j.config.chartKey)
				}
			},
			statusChanged: function (m, k, l) {
				if (k.config.onStatusChanged) {
					var j = l.data;
					k.config.onStatusChanged(j, k.config.chartKey)
				}
			},
			exitRequested: function (k, j) {
				j.config.onExitRequested()
			}
		};
		a.SeatsioSessionStorage = function (j) {
			this.chartId = j
		};
		a.SeatsioSessionStorage.prototype.fetch = function (j) {
			return this.getStoreForChart()[j]
		};
		a.SeatsioSessionStorage.prototype.store = function (k, l) {
			var j = this.getStoreForChart();
			j[k] = l;
			this.setStoreForChart(j)
		};
		a.SeatsioSessionStorage.prototype.getStoreForChart = function () {
			var j = this.getStoreForAllCharts();
			var k = j["chart-" + this.chartId];
			if (!k) {
				return {}
			}
			return k
		};
		a.SeatsioSessionStorage.prototype.setStoreForChart = function (k) {
			var j = this.getStoreForAllCharts();
			j["chart-" + this.chartId] = k;
			this.setStoreForAllCharts(j)
		};
		a.SeatsioSessionStorage.prototype.getStoreForAllCharts = function () {
			var j = sessionStorage.getItem("seatsio");
			if (!j) {
				return {}
			}
			return JSON.parse(j)
		};
		a.SeatsioSessionStorage.prototype.setStoreForAllCharts = function (j) {
			sessionStorage.setItem("seatsio", JSON.stringify(j))
		};
		a.SeatsioSessionStorage.isSupported = function () {
			try {
				sessionStorage.setItem("sessionStorageSupportedTest", "x");
				sessionStorage.removeItem("sessionStorageSupportedTest");
				return true
			} catch (j) {
				if (j.name == "QuotaExceededError") {
					return false
				}
				throw j
			}
		};
		a.SeatsioDummyStorage = function () {};
		a.SeatsioDummyStorage.prototype.fetch = function (j) {};
		a.SeatsioDummyStorage.prototype.store = function (j, k) {};
		a.SeatsioStorage = {};
		a.SeatsioStorage.create = function (j) {
			if (a.SeatsioSessionStorage.isSupported()) {
				return new a.SeatsioSessionStorage(j)
			}
			a.warn("Session storage not supported; stored data will be lost after page refresh");
			return new a.SeatsioDummyStorage()
		};
		b("message", c);
		b("keydown", e);
		b("keyup", e);
		g()
	})()
};