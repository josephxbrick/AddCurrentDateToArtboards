# AddCurrentDateToArtboards

A Sketch plugin that updates today's date on artboards in the current Sketch page that contain a symbol instance to display the page number. 

To see how it works, try the sample.sketch file in the repository.

To get a date, an artboard needs to include a symbol instance with a text override named `"<currentDate>"`. The name of the symbol instance itself does not matter. Note that this override cannot be in a nested symbol.

## Date template
If you don't provide a date template, the date format will default to MM/DD/YYYY. You can specify other date formats by placing various date templates in the default text of the text override. Your symbol (on the Symbols page) should look like this with a template:

<img src="/readme_images/sample.png" width="650">

Here are the supported formats:

### Month formats, assuming it's January:
* [MMMM] – January
* [MMM] – Jan
* [MM]  – 01
* [M] – 1

Note that the short [MMM] dates follow AP Style Guide recommendations, where March, April, May, June, and July are not abbrevieated, and September is abbreviated as Sept.

### Date formats, assiming it's the 3rd of the month:
* [DDD] – 3rd
* [DD] – 03
* [D] – 3

### Year formats, assuming it's 2021
* [YYYY] – 2021
* [YY] – 21

## Examples assuming it's January 3rd, 2021
* [MMMM] [DDD], [YYYY] – January 3rd, 2021
* [DD] [MMM] [YYYY] – 03 Jan 2021
* [MM].[DD].[YYYY] – 01.03.2021
* [M]/[D]/[YY] – 1/3/21
