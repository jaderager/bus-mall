# User Stories
As a Developer, ...
* I want to account for user idle time by informing them that they must maintain focus on the survey, and providing a button to reset their decision timer with new images
* I want all images assets to pre-load before the script begins
* I want my UI to look clean and professional
* I want my code to be as re-usable as possible

As a Marketing Researcher, ...
* I want basic metrics on click count as well as the click/view ratio
* I want the user to be as free of distractions as possible
* I want a list of 'foregone' choices associated with each click to better understand its context, as well as relative rankings
* I want metrics of how long it took the user to make a particular choice, and the mean click time, to identify how sure the user is
* I want better insight into why the user made the decisions they did, and want a precise format for users to submit this feedback for better analysis

As a Focus Group Participant, ...
* I want all images to the same size and aspect ratio, or least constrained by their bounding box
* I want feedback on how many images I've clicked, and how many I have left to click before finishing
* I want there to be good color contrast with the background, so that all images are visible no matter what color
* I want clear instructions on how to use the web app, and how my clicks are being interpreted
* I want to see my results clearly displayed at the end of the survey

# UI Flow
1. Intro screen: Explain to user that they are timed, and what to expect with an example of the UI. Explain what input they are providing.
2. Main app screen: Clear feedback as to which image is selected; user must hold down mouse button for a short time to prevent accidental misclicks. x/Samples counter displayed to provide feedback so user is not apprehensive of how many selections remain to be made. (optional) timer reinforces idea that user is being timed. Button which allows user to be given a new selection.
3. Results screen shows the user the data they've provided it, with parts that are only of interest to marketing researchers excluded. User is thanked for their time, and given the option to receive email updates of any products their data was used to develop.