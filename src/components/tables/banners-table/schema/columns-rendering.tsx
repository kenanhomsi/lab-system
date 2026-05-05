"use client";

import { Text } from "@mantine/core";
import { BannerItem } from "../types";

type Props = {
    row: BannerItem;
};

/**
 * ActionsRender component for banners table.
 * Currently no actions available as the API only supports read-only operations.
 */
const ActionsRender = (_props: Props) => {
    void _props;
    return (
        <Text size="xs" c="dimmed">
            —
        </Text>
    );
};

export { ActionsRender };
