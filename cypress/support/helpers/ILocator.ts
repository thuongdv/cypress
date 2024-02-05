export interface ILocator {
  selector: string;
  gSelector: string | null;
  type: HtmlLocatorType | null;
  reload: boolean | null;
}

export enum HtmlLocatorType {
  Link,
  Button,
  ComboBox,
  ComboBoxNumberValue,
  TextBox,
  RadioButton,
  Checkbox,
  DynamicControl,
  UnstableComboBox,
  DateTextBox,
  TextBoxWithValidation,
  Element,
}
