## 1.5.0 (8/07/2018)

#### New

* new option to enable parsing of exponential numbers (#13). this also fixes an
  outstanding bug where exponential numbers were being parsed accidentally.


## 1.4.2 (7/24/2018)

#### Fix

* test parsed floats for infinity (#12)

## 1.4.1 (6/13/2018)

* Upgrade lodash@4.17.10
* Upgrade various dev dependencies.

## 1.4.0 (5/25/2016)

* Expose new `parse` method.
* Expose main export as a factory method to persist options.

## 1.3.1 (5/23/2016)

* Fixed bug where 3 character strings would be parsed as 'NaN'.

## 1.3 (6/15/2015)

* Fixed bug where missing options flags were not being filled in by defaults.

## 1.2 (4/14/2015)

* Changed `parseJson`'s options object. Changed `integer` to `float` for better numbers and decimal support.

## 1.1 (4/13/2015)

* Updated license information.
