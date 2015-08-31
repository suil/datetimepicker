;
(function($) {
    'use strict';
    var DateTime = (function() {
        function DateTime(value) {
            var now = new Date();
            if (!value) {
                this.datetime = now;
                return;
            }
            this.datetime = new Date(value.year ? value.year : now.getFullYear(), value.month ? value.month - 1 : now.getMonth(), value.date ? value.date : now.getDate(), value.hour ? value.hour : now.getHours(), value.minute ? value.minute : now.getMinutes(), value.second ? value.second : now.getSeconds());
        }
        Object.defineProperty(DateTime.prototype, "decade", {
            get: function() {
                return Math.floor(this.year / 10) * 10;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "year", {
            get: function() {
                return this.datetime.getFullYear();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "month", {
            get: function() {
                return this.datetime.getMonth() + 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "date", {
            get: function() {
                return this.datetime.getDate();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "dayOfWeek", {
            get: function() {
                return this.datetime.getDay();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "hour", {
            get: function() {
                return this.datetime.getHours();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "minute", {
            get: function() {
                return this.datetime.getMinutes();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "second", {
            get: function() {
                return this.datetime.getSeconds();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "ampm", {
            get: function() {
                return (this.hour >= 12) ? 'pm' : 'am';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "ampmHour", {
            get: function() {
                var hour = (this.hour > 12) ? this.hour - 12 : this.hour;
                return (hour == 0) ? 12 : hour;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "dateObject", {
            get: function() {
                return this.datetime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateTime.prototype, "monthObject", {
            get: function() {
                return {
                    year: this.year,
                    month: this.month
                };
            },
            enumerable: true,
            configurable: true
        });
        DateTime.prototype.addYears = function(years) {
            this.datetime.setFullYear(this.year + years);
            return this;
        };
        DateTime.prototype.addMonths = function(months) {
            this.datetime.setMonth(this.month + months - 1);
            return this;
        };
        DateTime.prototype.addDays = function(dates) {
            this.datetime.setDate(this.date + dates);
            return this;
        };
        DateTime.prototype.addHours = function(hours) {
            this.datetime.setHours(this.hour + hours);
            return this;
        };
        DateTime.prototype.addMinutes = function(minutes) {
            this.datetime.setMinutes(this.minute + minutes);
            return this;
        };
        DateTime.prototype.addSeconds = function(seconds) {
            this.datetime.setSeconds(this.second + seconds);
            return this;
        };
        DateTime.prototype.set = function(prop, value) {
            switch (prop) {
                case "year":
                    this.datetime.setFullYear(value);
                    break;
                case "month":
                    this.datetime.setMonth(value - 1);
                    break;
                case "date":
                    this.datetime.setDate(value);
                    break;
                case "hour":
                    this.datetime.setHours(value);
                    break;
                case "minute":
                    this.datetime.setMinutes(value);
                    break;
                case "second":
                    this.datetime.setSeconds(value);
                    break;
                default:
                    throw prop + " property of Datetime can not be found";
            };
            return this;
        };
        DateTime.prototype.sets = function(values) {
            for (var prop in values) {
                this.set(prop, values[prop]);
            }
            return this;
        };
        DateTime.prototype.clone = function() {
            return new DateTime({
                year: this.year,
                month: this.month,
                date: this.date,
                hour: this.hour,
                minute: this.minute,
                second: this.second
            });
        };
        DateTime.cloneFrom = function(datetime, values) {
            if (datetime) {
                datetime = datetime.clone();
                if (values)
                    datetime.sets(values);
                return datetime;
            }
            return new DateTime(values);
        };
        return DateTime;
    })();
    var TimepickerView;
    (function(TimepickerView) {
        TimepickerView[TimepickerView["Dash"] = 0] = "Dash";
        TimepickerView[TimepickerView["Hours"] = 1] = "Hours";
        TimepickerView[TimepickerView["Minutes"] = 2] = "Minutes";
        TimepickerView[TimepickerView["Seconds"] = 3] = "Seconds";
    })(TimepickerView || (TimepickerView = {}));;
    var DatepickerView;
    (function(DatepickerView) {
        DatepickerView[DatepickerView["Days"] = 0] = "Days";
        DatepickerView[DatepickerView["Months"] = 1] = "Months";
        DatepickerView[DatepickerView["Years"] = 2] = "Years";
    })(DatepickerView || (DatepickerView = {}));;
    var PickerView;
    (function(PickerView) {
        PickerView[PickerView["TimePicker"] = 0] = "TimePicker";
        PickerView[PickerView["DatePicker"] = 1] = "DatePicker";
    })(PickerView || (PickerView = {}));;
    var State = (function() {
        function State(defaults) {
            for (var propertyName in defaults) {
                this[propertyName] = defaults[propertyName];
            }
            this.observers = {};
        }
        State.prototype.get = function(propertyName) {
            return this[propertyName];
        };
        State.prototype.set = function(propertyName, value) {
            var oldValue = this[propertyName];
            if (!this.isValueChanged(value, oldValue)) {
                return this;
            }
            this[propertyName] = value;
            this.notify(propertyName, value, oldValue);
            return this;
        };
        State.prototype.sets = function(values) {
            var _this = this;
            var changes = [];
            for (var propertyName in values) {
                var oldValue = this[propertyName];
                if (!this.isValueChanged(values[propertyName], oldValue)) {
                    continue;
                }
                this[propertyName] = values[propertyName];
                changes.push({
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: values[propertyName]
                });
            }
            changes.forEach(function(change) {
                _this.notify(change.propertyName, change.newValue, change.oldValue);
            });
            return this;
        };
        State.prototype.notify = function(propertyName, newValue, oldValue) {
            var callback = this.observers[propertyName];
            if (callback) {
                callback.call(this, newValue, oldValue);
            }
        };
        State.prototype.isValueChanged = function(newValue, oldValue) {
            if (typeof newValue === "object") {
                newValue = JSON.stringify(newValue);
            }
            if (typeof oldValue === "object") {
                oldValue = JSON.stringify(oldValue);
            }
            return newValue != oldValue;
        };
        State.prototype.onChange = function(propertyName, callback) {
            this.observers[propertyName] = callback;
        };
        return State;
    })();
    /// <reference path="datetime.ts" />
    var Template = (function() {
        function Template() {}
        Template.html2TemplateFn = function(str) {
            return new Function("obj", "var p=[];" +
                "with(obj){p.push('" +
                str
                .replace(/([^%])>\s+<%=/gm, "$1><%=")
                .replace(/%>\s+<\//gm, "%></")
                .replace(/class="\s+<%/gm, 'class="<%')
                .replace(/%>\s+<%/gm, '%> <%')
                .replace(/%>\s+">/gm, '%>">')
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") + "');}return p.join('');");
        };
        Template.renderDaysViewHtml = function(monthOfDaysView, selectedDateTime, regional) {
            var firstDayInMonth = new DateTime({
                    year: monthOfDaysView.year,
                    month: monthOfDaysView.month,
                    date: 1
                }),
                startDate = firstDayInMonth.clone().addDays(firstDayInMonth.dayOfWeek === 0 ? -7 : -firstDayInMonth.dayOfWeek);
            if (!selectedDateTime) {
                selectedDateTime = new DateTime();
            }
            var dates = [],
                date = startDate;
            for (var i = 0; i < 42; i++) {
                var isSelected = selectedDateTime.year == monthOfDaysView.year && selectedDateTime.month == monthOfDaysView.month && selectedDateTime.date == date.date && date.month == monthOfDaysView.month;
                dates.push({
                    date: date.date,
                    isSelected: isSelected,
                    isInPrevMonth: date.month < monthOfDaysView.month,
                    isInNextMonth: date.month > monthOfDaysView.month
                });
                date.addDays(1);
            }
            return this.html2TemplateFn(this.daysViewTemplateHtml)({
                monthOfDaysView: monthOfDaysView,
                datesInDaysView: dates,
                reginal: regional
            });
        };
        Template.renderMonthsViewHtml = function(yearOfMonthsView, selectedDateTime, regional) {
            if (!selectedDateTime) {
                selectedDateTime = new DateTime();
            }
            return this.html2TemplateFn(this.monthsViewTemplateHtml)({
                yearOfMonthsView: yearOfMonthsView,
                selectedYear: selectedDateTime.year,
                selectedMonth: selectedDateTime.month,
                reginal: regional
            });
        };
        Template.renderYearsViewHtml = function(decadeOfYearsView, selectedDateTime, regional) {
            if (!selectedDateTime) {
                selectedDateTime = new DateTime();
            }
            return this.html2TemplateFn(this.yearsViewTemplateHtml)({
                decadeOfYearsView: decadeOfYearsView,
                selectedYear: selectedDateTime.year,
                reginal: regional
            });
        };
        Template.renderCalendarDropdownHtml = function(monthOfDaysView, yearOfMonthsView, decadeOfYearsView, selectedDateTime, use12Hours, useSeconds, regional) {
            if (!selectedDateTime) {
                selectedDateTime = new DateTime();
            }
            return this.html2TemplateFn(this.calendarDropdownTemplateHtml)({
                daysViewTemplate: this.renderDaysViewHtml(monthOfDaysView, selectedDateTime, regional),
                monthsViewTemplate: this.renderMonthsViewHtml(yearOfMonthsView, selectedDateTime, regional),
                yearsViewTemplate: this.renderYearsViewHtml(decadeOfYearsView, selectedDateTime, regional),
                selectedHour: selectedDateTime.hour,
                selectedMinute: selectedDateTime.minute,
                selectedSecond: selectedDateTime.second,
                selectedAmPm: selectedDateTime.ampm.toUpperCase(),
                use12Hours: use12Hours,
                useSeconds: useSeconds,
                reginal: regional
            });
        };
        Template.daysViewTemplateHtml = '\
<table class="days">\
<thead>\
    <tr>\
        <th class="prev"><span>‹</span></th>\
        <th colspan="5" class="title">\
            <%= reginal.monthNames[monthOfDaysView.month-1] %>\
            <%= monthOfDaysView.year %>\
        </th>\
        <th class="next"><span>›</span></th>\
    </tr>\
    <tr>\
        <% for (var i=0; i < reginal.dayNamesMin.length; i++) { %>\
            <th><%= reginal.dayNamesMin[i] %></th>\
        <% } %>\
    </tr>\
</thead>\
<tbody>\
    <% for (var i = 0; i < datesInDaysView.length; i++) { \
        if (i % 7 === 0) { %><tr><% } \
        var date = datesInDaysView[i]; %>\
        <td class="\
            <% if (date.isSelected) { %>active<% } %>\
            <% if (date.isInPrevMonth) { %>old<% } %>\
            <% if (date.isInNextMonth) { %>new<% } %>\
        ">\
            <%= date.date %>\
        </td>\
        <% if (i % 7 === 6) { %></tr><% } %>\
    <% } %>\
<tbody>\
</table>';
        Template.monthsViewTemplateHtml = '\
<table class="months">\
<thead>\
    <tr>\
        <th class="prev"><span>‹</span></th>\
        <th colspan="5" class="title"><%= yearOfMonthsView %></th>\
        <th class="next"><span>›</span></th>\
    </tr>\
</thead>\
<tbody>\
    <tr>\
        <td colspan="7">\
            <% for (var i=0; i < reginal.monthNamesShort.length; i++) { %>\
                <span <% if (yearOfMonthsView == selectedYear && i == selectedMonth - 1) {%> class="active" <%} %>>\
                    <%= reginal.monthNamesShort[i] %>\
                </span>\
            <% } %>\
        </td>\
    </tr>\
</tbody>\
</table>';
        Template.yearsViewTemplateHtml = '\
<table class="years">\
<thead>\
    <tr>\
        <th class="prev"><span>‹</span></th>\
        <th colspan="5" class="title">\
            <%= decadeOfYearsView %> - \
            <%= decadeOfYearsView + 9 %>\
        </th>\
        <th class="next"><span>›</span></th>\
    </tr>\
</thead>\
<tbody>\
    <tr>\
        <td colspan="7">\
            <% for (var year = decadeOfYearsView - 1; year <= decadeOfYearsView + 10; year++) { %>\
                <span class="\
                    <% if (year == selectedYear) { %>active<% } %> \
                    <% if (year == decadeOfYearsView - 1) { %>old<% } %>\
                    <% if (year == decadeOfYearsView + 10) { %>new<% } %>\
                ">\
                    <%= year %>\
                </span>\
            <% } %>\
        </td>\
    </tr>\
</tbody>\
</table>';
        Template.calendarDropdownTemplateHtml = '\
<div class="dtp-widget">\
<ul class="accordion">\
    <li>\
        <div class="datepicker">\
            <%= daysViewTemplate %>\
            <%= monthsViewTemplate %>\
            <%= yearsViewTemplate %>\
        </div>\
    </li>\
    <li class="switch">\
        <a class="btn"><i class="wait icon"></i></a>\
    </li>\
    <li class="collapsed">\
        <div class="timepicker">\
            <table class="dash">\
                <tbody>\
                    <tr>\
                        <td><a href="" class="btn hour up"><i class="chevron up icon"></i></a></td>\
                        <td class="separator"></td>\
                        <td><a href="" class="btn minute up"><i class="chevron up icon"></i></a></td>\
                        <% if (useSeconds) { %>\
                            <td class="separator"></td>\
                            <td><a href="" class="btn second up"><i class="chevron up icon"></i></a></td>\
                        <% } %>\
                        <td class="separator"></td>\
                        <% if (use12Hours) { %><td></td><% } %>\
                    </tr>\
                    <tr class="time">\
                        <td><a href="" class="hour"><%= ("0" + selectedHour).slice(-2) %></a></td>\
                        <td class="separator">:</td>\
                        <td><a href="" class="minute"><%= ("0" + selectedMinute).slice(-2) %></a></td>\
                        <% if (useSeconds) { %>\
                            <td class="separator">:</td>\
                            <td><a href="" class="second"><%= ("0" + selectedSecond).slice(-2) %></a></td>\
                        <% } %>\
                        <td class="separator"></td>\
                        <% if (use12Hours) { %><td><a class="btn ampm"><%= selectedAmPm %></a></td><% } %>\
                    </tr>\
                    <tr>\
                        <td><a href="" class="btn hour down"><i class="chevron down icon"></i></a></td>\
                        <td class="separator"></td>\
                        <td><a href="" class="btn minute down"><i class="chevron down icon"></i></a></td>\
                        <% if (useSeconds) { %>\
                            <td class="separator"></td>\
                            <td><a href="" class="btn second down"><i class="chevron down icon"></i></a></td>\
                        <% } %>\
                        <td class="separator"></td>\
                        <% if (use12Hours) { %><td></td><% } %>\
                    </tr>\
                </tbody>\
            </table>\
            <table class="hours hidden">\
                <tbody>\
                    <% for (var i=1; i<=(use12Hours?12:24); i++) { %>\
                        <% if (i % 4 === 1) { %><tr><% } %>\
                        <td><%= ("0" + i).slice(-2) %></td>\
                        <% if (i % 4 === 0) { %></tr><% } %>\
                    <% } %>\
                </tbody>\
            </table>\
            <table class="minutes hidden">\
                <tbody>\
                    <% for (var i=0; i<60; i++) { %>\
                        <% if (i % 6 === 0) { %><tr><% } %>\
                        <td><%= ("0" + i).slice(-2) %></td>\
                        <% if (i % 6 === 5) { %></tr><% } %>\
                    <% } %>\
                </tbody>\
            </table>\
            <table class="seconds hidden">\
                <tbody>\
                    <% for (var i=0; i<60; i++) { %>\
                        <% if (i % 6 === 0) { %><tr><% } %>\
                        <td><%= ("0" + i).slice(-2) %></td>\
                        <% if (i % 6 === 5) { %></tr><% } %>\
                    <% } %>\
                </tbody>\
            </table>\
        </div>\
    </li>\
</ul>\
</div>';
        return Template;
    })();
    /// <reference path="state.ts" />
    /// <reference path="template.ts" />
    function bindUi($input) {
        var storage = $input.data("datetimepicker"),
            state = storage.state,
            $calendar = storage.$calendar,
            $accordion = $calendar.find(".accordion"),
            $datepicker = $accordion.find(".datepicker"),
            $timepicker = $accordion.find(".timepicker");
        state.onChange("pickerView", function(value) {
            if (value === PickerView.DatePicker) {
                $accordion.find("li").eq(0).removeClass("collapsed");
                $accordion.find("li").eq(2).addClass("collapsed");
            } else if (value === PickerView.TimePicker) {
                $accordion.find("li").eq(0).addClass("collapsed");
                $accordion.find("li").eq(2).removeClass("collapsed");
            }
        });
        state.onChange("timepickerView", function(value) {
            $accordion.find(".timepicker>table").addClass("hidden");
            switch (value) {
                case TimepickerView.Dash:
                    $timepicker.find(".dash").removeClass("hidden");
                    break;
                case TimepickerView.Hours:
                    $timepicker.find(".hours").removeClass("hidden");
                    break;
                case TimepickerView.Minutes:
                    $timepicker.find(".minutes").removeClass("hidden");
                    break;
                case TimepickerView.Seconds:
                    $timepicker.find(".seconds").removeClass("hidden");
                    break;
            }
        });
        state.onChange("datepickerView", function(value) {
            $accordion.find(".datepicker>table").addClass("hidden");
            switch (value) {
                case DatepickerView.Days:
                    $datepicker.find(".days").removeClass("hidden");
                    break;
                case DatepickerView.Months:
                    $datepicker.find(".months").removeClass("hidden");
                    break;
                case DatepickerView.Years:
                    $datepicker.find(".years").removeClass("hidden");
                    break;
            }
        });
        state.onChange("isShown", function(isShown) {
            if (isShown) {
                var offset = $input.offset(),
                    outerHeight = $input.outerHeight();
                $calendar
                    .css({
                        top: offset.top + outerHeight,
                        left: offset.left
                    })
                    .appendTo("body");
            } else {
                storage.$calendar.detach();
            }
        });
        state.onChange("pickerView", function(pickerView) {
            switch (pickerView) {
                case PickerView.DatePicker:
                    $accordion.find("li:eq(2)").addClass("collapsed");
                    $accordion.find("li:eq(0)").removeClass("collapsed");
                    break;
                case PickerView.TimePicker:
                    $accordion.find("li:eq(0)").addClass("collapsed");
                    $accordion.find("li:eq(2)").removeClass("collapsed");
                    break;
            }
        });
        state.onChange("monthOfDaysView", function(monthOfDaysView) {
            var html = Template.renderDaysViewHtml(monthOfDaysView, state.get("selectedDateTime"), storage.options.regional);
            var $html = $(html);
            if (state.get("datepickerView") !== DatepickerView.Days) {
                $html.addClass("hidden");
            }
            $datepicker.find(".days").replaceWith($html);
        });
        state.onChange("yearOfMonthsView", function(yearOfMonthsView) {
            var html = Template.renderMonthsViewHtml(yearOfMonthsView, state.get("selectedDateTime"), storage.options.regional);
            var $html = $(html);
            if (state.get("datepickerView") !== DatepickerView.Months) {
                $html.addClass("hidden");
            }
            $datepicker.find(".months").replaceWith($html);
        });
        state.onChange("decadeOfYearsView", function(decadeOfYearsView) {
            var html = Template.renderYearsViewHtml(decadeOfYearsView, state.get("selectedDateTime"), storage.options.regional);
            var $html = $(html);
            if (state.get("datepickerView") !== DatepickerView.Years) {
                $html.addClass("hidden");
            }
            $datepicker.find(".years").replaceWith($html);
        });
        state.onChange("selectedDateTime", function(selectedDateTime) {
            if (!selectedDateTime) {
                return;
            }
            if (!storage.options.useSeconds) {
                selectedDateTime.set("second", 0);
            }
            $datepicker.find("table.days tbody tr td.active").removeClass("active");
            $datepicker.find("table.days tbody tr td:not(.old):not(.new)").filter(function() {
                return +$(this).text() === selectedDateTime.date;
            }).addClass("active");
            if (storage.options.use12Hours) {
                $timepicker.find(".time a.hour").text(("0" + selectedDateTime.ampmHour).slice(-2));
                $timepicker.find(".time a.ampm").text(selectedDateTime.ampm.toUpperCase());
            } else {
                $timepicker.find(".time a.hour").text(("0" + selectedDateTime.hour).slice(-2));
            }
            $timepicker.find(".time a.minute").text(("0" + selectedDateTime.minute).slice(-2));
            $timepicker.find(".time a.second").text(("0" + selectedDateTime.second).slice(-2));
            var formattedDate;
            if ($.isFunction(storage.options.beforeFormatDateTime)) {
                formattedDate = storage.options.beforeFormatDateTime.call($input.get(0), state.get("selectedDateTime").dateObject);
            } else {
                formattedDate = selectedDateTime.dateObject.toLocaleString();
            }
            $input.val(formattedDate);
            if ($.isFunction(storage.options.onChange)) {
                storage.options.onChange.call($input.get(0), state.get("selectedDateTime").dateObject);
            }
        });
    }
    /// <reference path="state.ts" />
    /// <reference path="datetime.ts" />
    function bindEvents($input) {
        var storage = $input.data("datetimepicker");
        var $calendar = storage.$calendar;
        var state = storage.state;
        $input.on("click.datetimepicker", function() {
            storage.state.set("isShown", true);
            var $body = $("body").on("mousedown.datetimepicker", function(ev) {
                if (!$.contains(storage.$calendar.get(0), ev.target) && $input.get(0) != ev.target) {
                    storage.state.set("isShown", false);
                    $body.off("mousedown.datetimepicker");
                }
            });
        });
        $calendar.on("click.datetimepicker", ".days .prev", function() {
            var prevMonth = new DateTime({
                year: state.get("monthOfDaysView").year,
                month: state.get("monthOfDaysView").month - 1
            });
            state.set("monthOfDaysView", {
                year: prevMonth.year,
                month: prevMonth.month
            });
        });
        $calendar.on("click.datetimepicker", ".days .next", function() {
            var nextMonth = new DateTime({
                year: state.get("monthOfDaysView").year,
                month: state.get("monthOfDaysView").month + 1
            });
            state.set("monthOfDaysView", {
                year: nextMonth.year,
                month: nextMonth.month
            });
        });
        $calendar.on("click.datetimepicker", ".months .prev", function() {
            var prevYear = state.get("yearOfMonthsView") - 1;
            state.set("yearOfMonthsView", prevYear);
        });
        $calendar.on("click.datetimepicker", ".months .next", function() {
            var nextYear = state.get("yearOfMonthsView") + 1;
            state.set("yearOfMonthsView", nextYear);
        });
        $calendar.on("click.datetimepicker", ".years .prev", function() {
            var prevDecade = state.get("decadeOfYearsView") - 10;
            state.set("decadeOfYearsView", prevDecade);
        });
        $calendar.on("click.datetimepicker", ".years .next", function() {
            var nextDecade = state.get("decadeOfYearsView") + 10;
            state.set("decadeOfYearsView", nextDecade);
        });
        storage.$calendar.find(".accordion li.switch").on("click.datetimepicker", function() {
            var currentPickerView = storage.state.get("pickerView");
            storage.state.set("pickerView", (currentPickerView == PickerView.DatePicker ? PickerView.TimePicker : PickerView.DatePicker));
        });
        storage.$calendar.on("click.datetimepicker", "table .title", function() {
            if (state.get("pickerView") === PickerView.DatePicker) {
                switch (state.get("datepickerView")) {
                    case DatepickerView.Days:
                        state.set("yearOfMonthsView", state.get("monthOfDaysView").year);
                        state.set("datepickerView", DatepickerView.Months);
                        break;
                    case DatepickerView.Months:
                        var year = state.get("monthOfDaysView").year;
                        var decade = Math.floor(year / 10) * 10;
                        state.set("decadeOfYearsView", decade);
                        state.set("datepickerView", DatepickerView.Years);
                        break;
                }
            }
        });
        storage.$calendar.on("click.datetimepicker", "table.days tbody td.old", function() {
            storage.$calendar.find(".datepicker .days .prev").trigger("click");
        });
        storage.$calendar.on("click.datetimepicker", "table.days tbody td.new", function() {
            storage.$calendar.find(".datepicker .days .next").trigger("click");
        });
        storage.$calendar.on("click.datetimepicker", "table.days tbody td:not(.old):not(.new)", function() {
            var date = +$(this).text();
            var selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"), {
                year: state.get("monthOfDaysView").year,
                month: state.get("monthOfDaysView").month,
                date: date
            });
            state.set("selectedDateTime", selectedDateTime);
            $("body").trigger("mousedown");
        });
        storage.$calendar.on("click.datetimepicker", "table.months tbody td span", function() {
            var selectedMonth = storage.$calendar.find("table.months tbody td span").index(this) + 1;
            var selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"), {
                year: state.get("yearOfMonthsView"),
                month: selectedMonth,
                date: 1
            });
            state.sets({
                "monthOfDaysView": selectedDateTime.monthObject,
                "selectedDateTime": selectedDateTime,
                "datepickerView": DatepickerView.Days
            });
        });
        storage.$calendar.on("click.datetimepicker", "table.years tbody td span", function() {
            var decadeOfYearsView = state.get("decadeOfYearsView"),
                selectedYear = storage.$calendar.find("table.years tbody td span").index(this) + decadeOfYearsView - 1;
            var selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"), {
                year: selectedYear,
                date: 1
            });
            state.sets({
                "selectedDateTime": selectedDateTime,
                "yearOfMonthsView": selectedYear,
                "datepickerView": DatepickerView.Months
            });
        });
        storage.$calendar.on("click.datetimepicker", "table.dash a.btn", function(ev) {
            ev.preventDefault();
            var $this = $(this),
                delta = 0,
                selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));
            if ($this.is(".up")) {
                delta = +1;
            } else if ($this.is(".down")) {
                delta = -1;
            }
            if ($this.is(".hour")) {
                state.set("selectedDateTime", selectedDateTime.addHours(delta));
            } else if ($this.is(".minute")) {
                state.set("selectedDateTime", selectedDateTime.addMinutes(delta));
            } else if ($this.is(".second")) {
                state.set("selectedDateTime", selectedDateTime.addSeconds(delta));
            }
        });
        storage.$calendar.on("click.datetimepicker", "table.dash a.ampm", function(ev) {
            ev.preventDefault();
            var ampm = $(this).text(),
                selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));
            if (ampm.toLowerCase() === "am") {
                state.set("selectedDateTime", selectedDateTime.addHours(12));
            } else if (ampm.toLowerCase() === "pm") {
                state.set("selectedDateTime", selectedDateTime.addHours(-12));
            }
        });
        storage.$calendar.on("click.datetimepicker", ".timepicker .dash .time a", function(ev) {
            ev.preventDefault();
            var $this = $(this);
            if ($this.is(".hour")) {
                state.set("timepickerView", TimepickerView.Hours);
            } else if ($this.is(".minute")) {
                state.set("timepickerView", TimepickerView.Minutes);
            } else if ($this.is(".second")) {
                state.set("timepickerView", TimepickerView.Seconds);
            }
        });
        storage.$calendar.on("click.datetimepicker", ".timepicker table.hours td", function() {
            var hour = +$(this).text(),
                selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));
            state.set("selectedDateTime", selectedDateTime.set("hour", hour));
            state.set("timepickerView", TimepickerView.Dash);
        });
        storage.$calendar.on("click.datetimepicker", ".timepicker table.minutes td", function() {
            var minute = +$(this).text(),
                selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));
            state.set("selectedDateTime", selectedDateTime.set("minute", minute));
            state.set("timepickerView", TimepickerView.Dash);
        });
        storage.$calendar.on("click.datetimepicker", ".timepicker table.seconds td", function() {
            var second = +$(this).text(),
                selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));
            state.set("selectedDateTime", selectedDateTime.set("second", second));
            state.set("timepickerView", TimepickerView.Dash);
        });
        $input.on("keypress.datetimepicker", function(ev) {
                ev.preventDefault();
            })
            .on("keydown.datetimepicker", function(ev) {
                ev.preventDefault();
            })
            .on("keyup.datetimepicker", function(ev) {
                ev.preventDefault();
            });
    }
    /// <reference path="datetime.ts" />
    /// <reference path="template.ts" />
    /// <reference path="uiBindings.ts" />
    /// <reference path="eventBindings.ts" />
    var methods = {
        init: function(options) {
            return this.each(function() {
                var $input = $(this),
                    initDateTime, storage = {
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
                var calendarHtml = Template.renderCalendarDropdownHtml({
                    year: initDateTime.year,
                    month: initDateTime.month
                }, initDateTime.year, initDateTime.decade, initDateTime, options.use12Hours, options.useSeconds, options.regional);
                storage.$calendar = $(calendarHtml);
                storage.$calendar.appendTo("body");
                bindUi($input);
                bindEvents($input);
                storage.state.sets({
                    "pickerView": PickerView.DatePicker,
                    "timepickerView": TimepickerView.Dash,
                    "datepickerView": DatepickerView.Days,
                    "monthOfDaysView": {
                        year: initDateTime.year,
                        month: initDateTime.month
                    },
                    "yearOfMonthsView": initDateTime.year,
                    "decadeOfYearsView": initDateTime.decade,
                    "selectedDateTime": undefined,
                    "isShown": false
                });
            });
        },
        getDate: function() {
            var $input = this.eq(0);
            var storage = $input.data("datetimepicker");
            return storage.state.get("selectedDateTime");
        },
        setDate: function(datetime) {
            return this.each(function() {
                var $input = $(this),
                    storage = $input.data("datetimepicker");
                storage.state.set("selectedDateTime");
            });
        }
    };
    $.fn.datetimepicker = function(options) {
        var setting = {
            use12Hours: true,
            useSeconds: false,
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
            },
            beforeFormatDateTime: undefined,
            beforeParseDateTime: undefined,
            onChange: undefined
        };
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            $.extend(setting, options);
            return methods.init.call(this, setting);
        }
    };


}(jQuery));
