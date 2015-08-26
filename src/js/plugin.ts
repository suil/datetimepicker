/// <reference path="datetime.ts" />
/// <reference path="template.ts" />
/// <reference path="uiBindings.ts" />
/// <reference path="eventBindings.ts" />

declare var $;

var methods = {

	init: function (options) {
		return this.each(function () {
			var $input = $(this),
				initDateTime,
				storage = {
					options: options,
					$input: $input,
					$calendar: undefined,
					state: new State()
				};

			var initialDate;
			if ($.isFunction(options.beforeParseDateTime)) {
				initialDate = options.beforeParseDateTime.call($input.get(0), $input.val());
			} else {
				initialDate = Date.parse($input.val());
			}

			if (initialDate instanceof Date) {
				initDateTime = new DateTime({
					year: initialDate.getFullYear(),
					month: initialDate.getMonth(),
					date: initialDate.getDate(),
					hour: initialDate.getHours(),
					minute: initialDate.getMinutes(),
					second: initialDate.getSeconds()
				});
			} else {
				initDateTime = new DateTime();
			}

			options.useSecond || initDateTime.set("second", 0);

			$input.data("datetimepicker", storage);

			var calendarHtml = Template.renderCalendarDropdownHtml(
				{ year: initDateTime.year, month: initDateTime.month },
				initDateTime.year,
				initDateTime.decade,
				initDateTime,
				options.use12Hours,
				options.useSeconds,
				options.regional
			);
			storage.$calendar = $(calendarHtml);
			storage.$calendar.appendTo("body");

			bindUi($input);

			bindEvents($input);

			storage.state.sets({
				"pickerView": PickerView.DatePicker,
				"timepickerView": TimepickerView.Dash,
				"datepickerView": DatepickerView.Days,
				"monthOfDaysView": { year: initDateTime.year, month: initDateTime.month },
				"yearOfMonthsView": initDateTime.year,
				"decadeOfYearsView": initDateTime.decade,
				"selectedDateTime": undefined,
				"isShown": false
			});
		});
	}
}

$.fn.datetimepicker = function (options) {
	var setting = {
		use12Hours: true,
		useSeconds: false,
		beforeFormatDateTime: undefined,
		beforeParseDateTime: undefined,
		regional: {
			monthNames: [
				"January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			],
			monthNamesShort: [
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
				"Sep", "Oct", "Nov", "Dec"
			],
			dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		}
	};
	
	if (methods[options]) {
		return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof options === 'object' || !options) {
		$.extend(setting, options);
		return methods.init.call(this, setting);
	}
}
