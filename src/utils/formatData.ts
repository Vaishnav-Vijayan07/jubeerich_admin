export function formatChangedFields(apiResponse: any[]) {
  if (!apiResponse) {
    return [];
  }

  return apiResponse.map((item: any) => {
    const formattedItem: Record<string, any> = {
      id: item.id || "N/A",
      lead_id: item.lead_id || "N/A",
      executive_id: item.executive_id || "N/A",
      date: item.date ? new Date(item.date).toLocaleString() : "N/A",
    };

    // Add dynamically changed fields based on your criteria
    if (item.checklist) {
      formattedItem.checklist = item.checklist;
    }
    if (item.comments) {
      formattedItem.comments = item.comments;
    }
    if (item.status) {
      formattedItem.status = item.status;
    }
    if (item.status_id) {
      formattedItem.status_id = item.status_id;
    }
    if (item.action_id) {
      formattedItem.action_id = item.action_id;
    }
    if (item.price) {
      formattedItem.price = item.price;
    }
    if (item.follow_up_date) {
      formattedItem.follow_up_date = item.follow_up_date;
    }

    return formattedItem;
  });
}

export const formatString = (str: string) => {
  // Remove underscores, capitalize first character, and lowercase the rest
  return str
    ?.replace(/_/g, " ") // Replace underscores with spaces
    ?.toLowerCase() // Convert entire string to lowercase
    ?.replace(/^\w/, (c: string) => c.toUpperCase()); // Capitalize the first character
};

export const capitalizeFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
