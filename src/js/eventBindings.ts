/// <reference path="state.ts" />
/// <reference path="datetime.ts" />

declare var $;

function bindEvents($input) {

	var storage = $input.data("datetimepicker");
    var $calendar = storage.$calendar;
    var state: State = storage.state;

    // calendar dropdown showing event, also binds a one-time event to
    // close the dropdown
    $input.on("click.datetimepicker", () => {
        storage.state.set("isShown", true);

        var $body = $("body").on("mousedown.datetimepicker", (ev) => {
            // let calendar pop still show if clicking within itself
            if (!$.contains(storage.$calendar.get(0), ev.target) && $input.get(0) != ev.target) {
                storage.state.set("isShown", false);
                $body.off("mousedown.datetimepicker");
            }
        });
    });

    // days view next
    $calendar.on("click.datetimepicker", ".days .prev", () => {
        var prevMonth = new DateTime({
            year: state.get("monthOfDaysView").year,
            month: state.get("monthOfDaysView").month - 1,
            date: 1
        });

        state.set("monthOfDaysView", prevMonth.monthObject);
    });

    $calendar.on("click.datetimepicker", ".days .next", () => {
        var nextMonth = new DateTime({
            year: state.get("monthOfDaysView").year,
            month: state.get("monthOfDaysView").month + 1,
            date: 1
        });

        state.set("monthOfDaysView", nextMonth.monthObject);
    });

    // months view
    $calendar.on("click.datetimepicker", ".months .prev", () => {
        var prevYear = state.get("yearOfMonthsView") - 1;
        state.set("yearOfMonthsView", prevYear);
    });

    $calendar.on("click.datetimepicker", ".months .next", () => {
        var nextYear = state.get("yearOfMonthsView") + 1;
        state.set("yearOfMonthsView", nextYear);
    });

    // years view
    $calendar.on("click.datetimepicker", ".years .prev", () => {
        var prevDecade = state.get("decadeOfYearsView") - 10;
        state.set("decadeOfYearsView", prevDecade);
    });

    $calendar.on("click.datetimepicker", ".years .next", () => {
        var nextDecade = state.get("decadeOfYearsView") + 10;
        state.set("decadeOfYearsView", nextDecade);
    });

    storage.$calendar.find(".accordion li.switch").on("click.datetimepicker", () => {
        var currentPickerView = storage.state.get("pickerView");
        storage.state.set(
            "pickerView",
            (currentPickerView == PickerView.DatePicker ? PickerView.TimePicker : PickerView.DatePicker)
        );
    });

    storage.$calendar.on("click.datetimepicker", "table .title", () => {
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

    // datepicker day selection
    storage.$calendar.on("click.datetimepicker", "table.days tbody td.old", () => {
        storage.$calendar.find(".datepicker .days .prev").trigger("click");
    });

    storage.$calendar.on("click.datetimepicker", "table.days tbody td.new", () => {
        storage.$calendar.find(".datepicker .days .next").trigger("click");
    });

    storage.$calendar.on("click.datetimepicker", "table.days tbody td:not(.old):not(.new)", function() {
        var date = +$(this).text();

        var selectedDateTime = DateTime.cloneFrom(
            state.get("selectedDateTime"),
            {
                year: state.get("monthOfDaysView").year,
                month: state.get("monthOfDaysView").month,
                date: date
            }
        );

        state.set("selectedDateTime", selectedDateTime);
        
        $("body").trigger("mousedown");
    });

    storage.$calendar.on("click.datetimepicker", "table.months tbody td span", function() {
        var selectedMonth = storage.$calendar.find("table.months tbody td span").index(this) + 1;
        var selectedDateTime = DateTime.cloneFrom(
            state.get("selectedDateTime"),
            {
                year: state.get("yearOfMonthsView"),
                month: selectedMonth,
                date: 1
            }
        );

        state.sets({
            "monthOfDaysView": selectedDateTime.monthObject,
            "selectedDateTime": selectedDateTime,
            "datepickerView": DatepickerView.Days
        });
    });

    storage.$calendar.on("click.datetimepicker", "table.years tbody td span", function () {
        var decadeOfYearsView = state.get("decadeOfYearsView"),
            selectedYear = storage.$calendar.find("table.years tbody td span").index(this) + decadeOfYearsView - 1;

        var selectedDateTime = DateTime.cloneFrom(
            state.get("selectedDateTime"),
            {
                year: selectedYear,
                date: 1
            }
        );

        state.sets({
            "selectedDateTime": selectedDateTime,
            "yearOfMonthsView": selectedYear,
            "datepickerView": DatepickerView.Months
        });
    });

    storage.$calendar.on("click.datetimepicker", "table.dash a.btn", function (ev) {
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
        }
        else if ($this.is(".minute")) {
            state.set("selectedDateTime", selectedDateTime.addMinutes(delta));
        }
        else if ($this.is(".second")) {
            state.set("selectedDateTime", selectedDateTime.addSeconds(delta));
        }
    });

    storage.$calendar.on("click.datetimepicker", "table.dash a.ampm", function(ev) {
        ev.preventDefault();

        var ampm = $(this).text(),
            selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));

        if (ampm.toLowerCase() === "am") {
            state.set("selectedDateTime", selectedDateTime.addHours(12));
        }
        else if (ampm.toLowerCase() === "pm") {
            state.set("selectedDateTime", selectedDateTime.addHours(-12));
        }
    });

    storage.$calendar.on("click.datetimepicker", ".timepicker .dash .time a", function(ev) {
        ev.preventDefault();
        var $this = $(this);

        if ($this.is(".hour")) {
            state.set("timepickerView", TimepickerView.Hours);
        }
        else if ($this.is(".minute")) {
            state.set("timepickerView", TimepickerView.Minutes);
        }
        else if ($this.is(".second")) {
            state.set("timepickerView", TimepickerView.Seconds);
        }
    });

    // timepicker hour selecting events
    storage.$calendar.on("click.datetimepicker", ".timepicker table.hours td", function() {
        var hour = +$(this).text(),
            selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));

        state.set("selectedDateTime", selectedDateTime.set("hour", hour));
        state.set("timepickerView", TimepickerView.Dash);
    });

    // timepicker minute selecting events
    storage.$calendar.on("click.datetimepicker", ".timepicker table.minutes td", function () {
        var minute = +$(this).text(),
            selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));

        state.set("selectedDateTime", selectedDateTime.set("minute", minute));
        state.set("timepickerView", TimepickerView.Dash);
    });

    // timepicker second selecting events
    storage.$calendar.on("click.datetimepicker", ".timepicker table.seconds td", function () {
        var second = +$(this).text(),
            selectedDateTime = DateTime.cloneFrom(state.get("selectedDateTime"));

        state.set("selectedDateTime", selectedDateTime.set("second", second));
        state.set("timepickerView", TimepickerView.Dash);
    });

    // Disable all the Keyboard Events
    $input.on("keypress.datetimepicker", (ev) => {
        ev.preventDefault();
    })
    .on("keydown.datetimepicker", (ev) => {
        ev.preventDefault();
    })
    .on("keyup.datetimepicker", (ev) => {
        ev.preventDefault();
    });

}
