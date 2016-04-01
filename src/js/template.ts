/// <reference path="datetime.ts" />

class Template {

    private static daysViewTemplateHtml: string = '\
<table class="days">\
<thead>\
    <tr>\
        <th class="prev"><span>‹</span></th>\
        <th colspan="5" class="title">\
            <%= regional.monthNames[monthOfDaysView.month-1] %>\
            <%= monthOfDaysView.year %>\
        </th>\
        <th class="next"><span>›</span></th>\
    </tr>\
    <tr>\
        <% for (var i=0; i < regional.dayNamesMin.length; i++) { %>\
            <th><%= regional.dayNamesMin[i] %></th>\
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

    private static monthsViewTemplateHtml: string = '\
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
            <% for (var i=0; i < regional.monthNamesShort.length; i++) { %>\
                <span <% if (yearOfMonthsView == selectedYear && i == selectedMonth - 1) {%> class="active" <%} %>>\
                    <%= regional.monthNamesShort[i] %>\
                </span>\
            <% } %>\
        </td>\
    </tr>\
</tbody>\
</table>';

    private static yearsViewTemplateHtml: string = '\
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

    private static calendarDropdownTemplateHtml = '\
<div class="dtp-widget">\
<ul class="accordion">\
    <li>\
        <div class="datepicker">\
            <%= daysViewTemplate %>\
            <%= monthsViewTemplate %>\
            <%= yearsViewTemplate %>\
        </div>\
    </li>\
    <% if (useTime) { %>\
        <li class="switch">\
            <a class="btn"><i class="wait icon"></i></a>\
        </li>\
    <% } %>\
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


    // http://ejohn.org/blog/javascript-micro-templating/
    private static html2TemplateFn(str: string): Function {
        return new Function("obj",
            "var p=[];" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
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
                .split("\r").join("\\'")

            + "');}return p.join('');");
    }

    static renderDaysViewHtml(monthOfDaysView: IMonth, selectedDateTime: DateTime, regional: {}): string {
        // get the start date in a month calendar
        var firstDayInMonth = new DateTime({ year: monthOfDaysView.year, month: monthOfDaysView.month, date: 1 }),
            startDate = firstDayInMonth.clone().addDays(
                firstDayInMonth.dayOfWeek === 0 ? -7 : -firstDayInMonth.dayOfWeek
            );
        if (!selectedDateTime) { selectedDateTime = new DateTime(); }

        // get all 42 dates in a month calendar
        var dates: {}[] = [], date = startDate;
        for (var i = 0; i < 42; i++) {
            var isSelected = selectedDateTime.year == monthOfDaysView.year
                && selectedDateTime.month == monthOfDaysView.month
                && selectedDateTime.date == date.date
                && date.month == monthOfDaysView.month;

            dates.push({
                date: date.date,
                isSelected: isSelected,
                isInPrevMonth: date.month < monthOfDaysView.month,
                isInNextMonth: date.month > monthOfDaysView.month
            });

            date.addDays(1);
        }

        // As the logics for getting 42 dates in a month calendar is too complex for a template
        // move it out here to make template codes cleaner.
        return this.html2TemplateFn(this.daysViewTemplateHtml)({
            monthOfDaysView: monthOfDaysView,
            datesInDaysView: dates,
            regional: regional
        });
    }

    static renderMonthsViewHtml(yearOfMonthsView: number, selectedDateTime: DateTime, regional: {}): string {
        if (!selectedDateTime) { selectedDateTime = new DateTime(); }

        return this.html2TemplateFn(this.monthsViewTemplateHtml)({
            yearOfMonthsView: yearOfMonthsView,
            selectedYear: selectedDateTime.year,
            selectedMonth: selectedDateTime.month,
            regional: regional
        });
    }

    static renderYearsViewHtml(decadeOfYearsView: number, selectedDateTime: DateTime, regional: {}): string {
        if (!selectedDateTime) { selectedDateTime = new DateTime(); }

        return this.html2TemplateFn(this.yearsViewTemplateHtml)({
            decadeOfYearsView: decadeOfYearsView,
            selectedYear: selectedDateTime.year,
            regional: regional
        });
    }

    static renderCalendarDropdownHtml(
        monthOfDaysView: IMonth,
        yearOfMonthsView: number,
        decadeOfYearsView: number,
        selectedDateTime: DateTime,
        use12Hours: boolean,
        useSeconds: boolean,
        useTime: boolean,
        regional: {}): string
    {
        if (!selectedDateTime) { selectedDateTime = new DateTime(); }

        return this.html2TemplateFn(this.calendarDropdownTemplateHtml)({
            daysViewTemplate: this.renderDaysViewHtml(monthOfDaysView, selectedDateTime, regional),
            monthsViewTemplate: this.renderMonthsViewHtml(yearOfMonthsView, selectedDateTime, regional),
            yearsViewTemplate: this.renderYearsViewHtml(decadeOfYearsView, selectedDateTime, regional),
            selectedHour: selectedDateTime.hour,
            selectedMinute: selectedDateTime.minute,
            selectedSecond: selectedDateTime.second,
            selectedAmPm: selectedDateTime.ampm.toUpperCase(),
            use12Hours,
            useSeconds,
            useTime,
            regional
        });
    }
}
