import { useState, useEffect } from "react";
import { fetchNui } from "./fetchNui";

interface LangData {
    [key: string]: string;
}

const defaultLangData: LangData = {
    // ADMS
    GarageName: "Garage Name",
    GarageCreateSpan: "Unique name per garage",
    GarageJob: "Job",
    GarageJobSpan: "If you don't write anything it will be for everybody.",
    GarageType: "Garage Type",
    GarageTypeSpan: "Type of garage, 2 options garage or impound",
    GarageType1: "Garage",
    GarageType2: "Impound",
    GarageType3: "Custom",
    GarageImpound: "Price impound",
    GarageImpoundSpan: "Set a default price for vehicle recovery from this impound.",
    GarageSociety: "Society",
    GarageSocietySpan: "Name of society to which the funds raised will go",
    GarageActionType: "Action zone Type",
    GarageActionTypeSpan: "Way in which the garage is accessed, target or textui.",
    GarageActionType1: "Target",
    GarageActionType2: "Textui",
    GarageNPC: "NPC",
    GarageNPCSpan: "Adds an NPC to the target zone, works with the coordinates of the garage Coord.",
    GarageVehicleType: "Vehicle type",
    GarageVehicleTypeSpan: "Select the categories of vehicles that can be parked.",
    GarageDebug: "Zone Debug",
    GarageDebugSpan: "Change debug zone",
    GarageInTocar: "In to car",
    GarageInTocarSpan: "Set Player on vehicle when spawn",
    GarageBlip: "Blip",
    GarageBlipSpan: "Hide / show blip garage",
    GarageCustomCars: "Custom cars",
    GarageCustomCarsSpan: "Sets a list of default vehicles, only vehicles spawned from this garage can be saved.",
    GarageRentACar: "Rent a car",
    GarageRentACarSpan: "Set price for rent a vehicle",
    GarageSharedVehicles: "Shared vehicles",
    GarageSharedVehiclesSpan:  "No restriction on Garages Names/Types",
    GarageDefaultImpound:"Default impound Recovery",
    GarageDefaultImpoundSpan:"Not finish",
    GaragePayMethod: "Metodo de pago",
    GaragePayMethodMoney: "Cash",
    GaragePayMethodBank: "Bank account",
    GarageButton1:"Coords",
    GarageButton2:"Set Zone",
    GarageButton3:"Spawn Coords",
    GarageButton4:"Create Garage",
    GarageButton5:"Teleport",
    GarageButton6:"Update",
    GarageButton7:"Delete",
    GarageButton8:"Garage List",
    GarageMenu1: "Precio:",
    GarageMenu2: "Fecha:",
    GarageMenu3: "Pagar y recuperar",
    GarageMenu4: "Kilometros",
    GarageMenu5: "Retirar",
    GarageMenu6: "Llaves",
    GarageMenu7: "GPS",
    GarageMenu9: "Gasolina",
    GarageMenu10: "Motor",
    GarageMenu11: "Carroceria",
    GarageMenu12: "GPS",
};

const Lang = () => {
    const [lang, setLang] = useState<LangData>(defaultLangData);
    useEffect(() => {
        fetchNui<LangData>('mGarage:Lang')
            .then(data => {
                setLang(data);
            })
            .catch(error => {
                console.error('Error fetching language data:', error);
            });
    }, []);

    return lang;
};

export default Lang;
