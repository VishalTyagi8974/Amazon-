function formatAddress(baseAddress, locationDetails, pincode) {
    const { city, county, state, country } = locationDetails;

    const cityOrCounty = city ? city : county ? county : "";

    let fullAddress = baseAddress;

    if (cityOrCounty) {
        fullAddress += `, ${cityOrCounty}`;
    }
    if (state) {
        fullAddress += `, ${state}`;
    }
    if (country) {
        fullAddress += `, ${country}`;
    }
    fullAddress += `, ${pincode}`;

    return fullAddress;
}

export default formatAddress;