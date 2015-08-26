enum TimepickerView { Dash, Hours, Minutes, Seconds };
enum DatepickerView { Days, Months, Years };
enum PickerView { TimePicker, DatePicker };

class State {
    private pickerView: PickerView;
    private timepickerView: TimepickerView;
    private datepickerView: DatepickerView;
    private monthOfDaysView: IMonth;
    private yearOfMonthsView: number;
    private decadeOfYearsView: number;
    private isShown: boolean;
    private selectedDateTime: DateTime;

    private observers: {};

    constructor(defaults?: {}) {
        for (var propertyName in defaults) {
            this[propertyName] = defaults[propertyName];
        }
        this.observers = {};
    }

    get(propertyName: string): any {
        return this[propertyName];
    }

    set(propertyName: string, value: any): State {
        var oldValue = this[propertyName];
        if (!this.isValueChanged(value, oldValue)) { return this; }

        this[propertyName] = value;
        this.notify(propertyName, value, oldValue);
        return this;
    }

    sets(values: {}): State {
        var changes: any[] = [];
        for (var propertyName in values) {
            var oldValue = this[propertyName];
            if (!this.isValueChanged(values[propertyName], oldValue)) { continue; }
            this[propertyName] = values[propertyName];
            changes.push({ propertyName: propertyName, oldValue: oldValue, newValue: values[propertyName] });
        }

        // fire change event all together
        changes.forEach(change => {
            this.notify(change.propertyName, change.newValue, change.oldValue);
        });

        return this;
    }

    private notify(propertyName: string, newValue: any, oldValue: any): void {
        var callback = this.observers[propertyName];
        if (callback) {
            callback.call(this, newValue, oldValue);
        }
    }

    private isValueChanged(newValue: any, oldValue: any): boolean {
        if (typeof newValue === "object") { newValue = JSON.stringify(newValue); }
        if (typeof oldValue === "object") { oldValue = JSON.stringify(oldValue); }

        return newValue != oldValue;
    }

    public onChange(propertyName: string, callback: () => {}) {
        this.observers[propertyName] = callback;
    }
}
