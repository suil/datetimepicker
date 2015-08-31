interface IMonth {
    year: number;
    month: number;
}

class DateTime {
    private datetime: Date;

    constructor(value?) {
        var now = new Date();
        if (!value) {
            this.datetime = now;
            return;
        }
        
        if (value instanceof Date) {
            this.datetime = new Date(value.getTime());
            return;
        }
        
        this.datetime = new Date(
            value.year ? value.year : now.getFullYear() ,
            value.month ? value.month - 1 : now.getMonth(),
            value.date ? value.date : value.month ? 1 : now.getDate(),
            value.hour ? value.hour : now.getHours(),
            value.minute ? value.minute : now.getMinutes(),
            value.second ? value.second : now.getSeconds()
        );
    }

    get decade(): number {
        return Math.floor(this.year / 10) * 10;
    }

    get year(): number {
        return this.datetime.getFullYear();
    }

    get month(): number {
        return this.datetime.getMonth() + 1;
    }

    get date(): number {
        return this.datetime.getDate();
    }

    get dayOfWeek(): number {
        return this.datetime.getDay();
    }

    get hour(): number {
        return this.datetime.getHours();
    }

    get minute(): number {
        return this.datetime.getMinutes();
    }

    get second(): number {
        return this.datetime.getSeconds();
    }

    get ampm(): string {
        return (this.hour >= 12) ? 'pm' : 'am';
    }

    get ampmHour(): number {
        var hour = (this.hour > 12) ? this.hour - 12 : this.hour;
        return (hour == 0) ? 12 : hour;
    }

    get dateObject(): Date {
        return this.datetime;
    }

    get monthObject(): IMonth {
        return { year: this.year, month: this.month };
    }

    addYears(years: number): DateTime {
        this.datetime.setFullYear(this.year + years);
        return this;
    }

    addMonths(months: number) {
        this.datetime.setMonth(this.month + months - 1);
        return this;
    }

    addDays(dates: number): DateTime {
        this.datetime.setDate(this.date + dates);
        return this;
    }

    addHours(hours: number): DateTime {
        this.datetime.setHours(this.hour + hours);
        return this;
    }

    addMinutes(minutes: number) {
        this.datetime.setMinutes(this.minute + minutes);
        return this;
    }

    addSeconds(seconds: number): DateTime {
        this.datetime.setSeconds(this.second + seconds);
        return this;
    }

    set(prop: string, value: number): DateTime {
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
    }

    sets(values: {}): DateTime {
        for (var prop in values) {
            this.set(prop, values[prop]);
        }
        return this;
    }

    clone(): DateTime {
        return new DateTime({
            year: this.year,
            month: this.month,
            date: this.date,
            hour: this.hour,
            minute: this.minute,
            second: this.second
        });
    }

    static cloneFrom(datetime: DateTime, values?: {}): DateTime {
        if (datetime) {
            datetime = datetime.clone();
            if (values) datetime.sets(values);
            return datetime;
        }
        return new DateTime(values);
    }
}
