export interface ProductSelectionResourceIdentifier {
    id?: string;
    key: string;
    type: "product-selection"
}

export interface ProductSelectionSettingDraft {
    productSelection: ProductSelectionResourceIdentifier;
    active: boolean;
}
