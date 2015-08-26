/// <reference path="state.ts" />
/// <reference path="template.ts" />
declare var $;

function bindUi($input) {
    var storage = $input.data("datetimepicker"),
        state = storage.state,
        $calendar = storage.$calendar,
        $accordion = $calendar.find(".accordion"),
        $datepicker = $accordion.find(".datepicker"),
        $timepicker = $accordion.find(".timepicker");

    state.onChange("pickerView", (value) => {
        if (value === PickerView.DatePicker) {
            $accordion.find("li").eq(0).removeClass("collapsed");
            $accordion.find("li").eq(2).addClass("collapsed");
        }
        else if (value === PickerView.TimePicker) {
            $accordion.find("li").eq(0).addClass("collapsed");
            $accordion.find("li").eq(2).removeClass("collapsed");
        }
    });

    state.onChange("timepickerView", (value) => {
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

    state.onChange("datepickerView", (value) => {
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

    state.onChange("isShown", (isShown) => {
        if (isShown) {
            var offset = $input.offset(),
                outerHeight = $input.outerHeight();
            $calendar
                .css({ top: offset.top + outerHeight, left: offset.left })
                .appendTo("body");
        } else {
            storage.$calendar.detach();
        }
    });

    state.onChange("pickerView", (pickerView: PickerView) => {
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

    state.onChange("monthOfDaysView", (monthOfDaysView: IMonth) => {
        var html = Template.renderDaysViewHtml(
            monthOfDaysView,
            state.get("selectedDateTime"),
            storage.options.regional
        );

        var $html = $(html);
        if (state.get("datepickerView") !== DatepickerView.Days) {
            $html.addClass("hidden");
        }

        $datepicker.find(".days").replaceWith($html);
    });

    state.onChange("yearOfMonthsView", (yearOfMonthsView: number) => {
        var html = Template.renderMonthsViewHtml(
            yearOfMonthsView,
            state.get("selectedDateTime"),
            storage.options.regional
        );

        var $html = $(html);
        if (state.get("datepickerView") !== DatepickerView.Months) {
            $html.addClass("hidden");
        }

        $datepicker.find(".months").replaceWith($html);
    });

    state.onChange("decadeOfYearsView", (decadeOfYearsView: number) => {
        var html = Template.renderYearsViewHtml(
            decadeOfYearsView,
            state.get("selectedDateTime"),
            storage.options.regional
        );

        var $html = $(html);
        if (state.get("datepickerView") !== DatepickerView.Years) {
            $html.addClass("hidden");
        }

        $datepicker.find(".years").replaceWith($html);
    });

    state.onChange("selectedDateTime", (selectedDateTime: DateTime) => {
        if (!selectedDateTime) { return; }

        //set second to 0 if useSeconds is false
        if (!storage.options.useSeconds) { selectedDateTime.set("second", 0); }

        // change datepicker view
        $datepicker.find("table.days tbody tr td.active").removeClass("active");
        $datepicker.find("table.days tbody tr td:not(.old):not(.new)").filter(function () {
            return +$(this).text() === selectedDateTime.date;
        }).addClass("active");

        // change timepicker view
        if (storage.options.use12Hours) {
            $timepicker.find(".time a.hour").text(("0" + selectedDateTime.ampmHour).slice(-2));
            $timepicker.find(".time a.ampm").text(selectedDateTime.ampm.toUpperCase());
        }
        else {
            $timepicker.find(".time a.hour").text(("0" + selectedDateTime.hour).slice(-2));
        }
        $timepicker.find(".time a.minute").text(("0" + selectedDateTime.minute).slice(-2));
        $timepicker.find(".time a.second").text(("0" + selectedDateTime.second).slice(-2));

        var formattedDate;
        if ($.isFunction(storage.options.beforeFormatDateTime)) {
            formattedDate = storage.options.beforeFormatDateTime.call($input.get(0), state.get("selectedDateTime").dateObject);
        }
        else {
            formattedDate = selectedDateTime.dateObject.toLocaleString();
        }
        $input.val(formattedDate);

    });
}
