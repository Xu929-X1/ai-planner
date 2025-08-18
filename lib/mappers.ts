function mapStatusCdToDesc(statusCd: "PENDING" |
    "IN_PROGRESS" |
    "COMPLETED" |
    "CANCELLED") {
    switch (statusCd) {
        case "PENDING":
            return "Pending";
        case "IN_PROGRESS":
            return "In progress";
        case "COMPLETED":
            return "Completed";
        case "CANCELLED":
            return "Cancelled";
    }
}

function mapDescToStatusCd(desc: string) {
    switch (desc) {
        case "Pending":
            return "PENDING";
        case "In progress":
            return "IN_PROGRESS";
        case "Completed":
            return "COMPLETED";
        case "Cancelled":
            return "CANCELLED";
        default:
            throw new Error(`Unknown status description: ${desc}`);
    }
}

export {
    mapStatusCdToDesc,
    mapDescToStatusCd
}