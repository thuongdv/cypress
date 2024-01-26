export interface ILocator {
  selector: string;
  gSelector: string;
  type: HtmlLocatorType;
  reload: boolean;
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
