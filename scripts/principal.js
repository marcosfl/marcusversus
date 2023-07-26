var loadedDropdown = false;


runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{

	
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.layout.addEventListener("beforelayoutstart", () => {
		loadedDropdown = false;
	});
}

function Tick(runtime)
{
	// this will try to get the array instances until the AJAX is loaded, then load the dropdown lists
	if (!loadedDropdown){
		//Load json (array) instances
		const charArr = runtime.objects.arr_Characters.getFirstInstance();
		const stagesArr = runtime.objects.arr_StagePlacement.getFirstInstance();
		
		//Don't load the dropdown lists if the arrays aren't available yet
		if (charArr.width <= 0 || stagesArr.width <= 0) {
			return;
		}
		
		loadedDropdown = true;
		
		//Cache the dropdown lists to save memory
		const charDropdown = runtime.objects.CharactersDropdown.getFirstInstance();
		const stagesDropdown = runtime.objects.StagesDropdown.getFirstInstance();
		
		for (var i = 1; i < charArr.width; i++){
			charDropdown.addItem(charArr.getAt(i, 0).toString()) //Add entries corresponding to character names in array
		}
		
		for (var i = 1; i < stagesArr.width; i++){
			stagesDropdown.addItem(stagesArr.getAt(i, 0).toString()) // Same here, but for stages
		}

		
		
		//Automatically selects the character / stage to correspond to their global variables
		const selectCurrent = (cur, dropdown, arr) => {
			var ind = 0;
			console.log(dropdown.selectedIndex)
			for (var i = 1; i < arr.width; i++){
				console.log(arr.getAt(i, 0).toString(), cur)
				if (arr.getAt(i, 0).toString() == cur) {
					ind = i;
					break;
				}
			}
			dropdown.selectedIndex = ind-1;
		}
		selectCurrent(runtime.globalVars.character, charDropdown, charArr);
		selectCurrent(runtime.globalVars.stage, stagesDropdown, stagesArr);
	}
}
