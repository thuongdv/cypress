import {CacheHelper} from "../helpers/cache-helper";
import CacheStorageKey from "../helpers/cache-storage-key";
import {HtmlLocatorType, ILocator} from "../helpers/ILocator";
import {JsonLocator} from "../helpers/json-locator";
import {DateTimeHelper} from "../helpers/date-time-helper";
import {CommonHelper} from "../helpers/common-helper";
import Button from "../elements/Button";
import Link from "../elements/Link";
import RadioButton from "../elements/RadioButton";
import DynamicControl from "../elements/DynamicControl";
import ComboBox from "../elements/ComboBox";
import UnstableComboBox from "../elements/UnstableComboBox";
import Checkbox from "../elements/Checkbox";
import BooleanHelper from "../helpers/boolean-helper";
import TextBox from "../elements/TextBox";
import LoadingElement from "../elements/LoadingElement";

export default class BasePage {
    public fillDataForPage(pageName: string, data: any): void {
        const dataLocalStorage = CacheHelper.getInstance().getItem(CacheStorageKey.DATA);
        for (const control in data) {
            if (!data.hasOwnProperty(control)) {
                continue;
            }

            let value = data[control];
            const locator: ILocator = JsonLocator.get(pageName, control);
            // Handle CypressError:
            // Typing into a date input with cy.type() requires a valid date with the format YYYY-MM-DD. You passed: 20/10/1990
            if (DateTimeHelper.isDate(value, DateTimeHelper.DATE_FORMAT) && locator.type === HtmlLocatorType.DateTextBox) {
                value = DateTimeHelper.changeDateFormat(value,
                    DateTimeHelper.DATE_FORMAT, DateTimeHelper.COMMON_DATE_FORMAT);
            }

            value = CommonHelper.generateValue(value);
            data[control] = value;

            // Skip if value is empty
            if (value.trim() === '') {
                continue;
            }

            switch (locator.type) {
                case HtmlLocatorType.TextBox:
                    new TextBox(locator).enter(value);
                    break;
                case HtmlLocatorType.TextBoxWithValidation:
                    new TextBox(locator).enterWithDelay(value, 300);
                    break;
                case HtmlLocatorType.DateTextBox:
                    new TextBox(locator).enter(value);
                    break;
                case HtmlLocatorType.Checkbox:
                    new Checkbox(locator).set(BooleanHelper.getBoolean(value));
                    break;
                case HtmlLocatorType.ComboBox:
                    new ComboBox(locator).select(value);
                    break;
                case HtmlLocatorType.UnstableComboBox:
                    new UnstableComboBox(locator).select(value);
                    break;
                case HtmlLocatorType.ComboBoxNumberValue:
                    new ComboBox(locator).selectByText(value);
                    break;
                case HtmlLocatorType.DynamicControl:
                    new DynamicControl(locator).clickDynamicControl(value);
                    break;
                case HtmlLocatorType.RadioButton:
                    new RadioButton(locator).check();
                    break;
                case HtmlLocatorType.Link:
                    new Link(locator).click();
                    break;
                case HtmlLocatorType.Button:
                    new Button(locator).click();
                    break;
                case HtmlLocatorType.Element:
                    break;
                default:
                    throw new Error(`Not matching type: ${HtmlLocatorType[locator.type]}`);
            }

            // If the control reloads page, need to wait
            if (locator.reload) {
                LoadingElement.waitForLoadingComplete();
            }
        }

        if (dataLocalStorage === null) {
            return;
        }
    }
}
