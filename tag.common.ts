/**
 * @author Win Min Tun
 * @version 1.0
 */
import { View } from 'ui/core/view';
import dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");

export class TagGroup extends View {
    // static (prototype) properties
    public static valueProperty: dependencyObservable.Property = new dependencyObservable.Property("value", "TagGroup", new proxy.PropertyMetadata(0, dependencyObservable.PropertyMetadataSettings.AffectsLayout));

    constructor() {
      super();
    }

    set value(val) {
      this._setValue(TagGroup.valueProperty, val)
    }

    get value() {
      return this._getValue(TagGroup.valueProperty);
    }

}