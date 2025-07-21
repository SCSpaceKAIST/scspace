import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export default function SimplePagination({ count, pageSize, onPageChange, page }: {
    count: number;
    pageSize: number;
    page: number;
    onPageChange: (page: { page: number }) => void;
}) {
    return (
        <Pagination.Root
            count={count}
            pageSize={pageSize}
            // siblingCount={2}
            page={page}
            onPageChange={onPageChange}
        >
            <ButtonGroup variant="ghost">
                <Pagination.PrevTrigger asChild>
                    <IconButton>
                        <HiChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>
                <Pagination.Items
                    render={(p) => (
                        <IconButton
                            variant={{
                                base: "ghost",
                                _selected: "outline"
                            }}
                        >
                            {p.value}
                        </IconButton>
                    )}
                />
                <Pagination.NextTrigger asChild>
                    <IconButton>
                        <HiChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    )
}