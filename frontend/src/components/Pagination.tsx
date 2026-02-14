import {
    Stack,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Typography,
    TextField
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import {useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export interface PaginationInfo {
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

interface PaginationProps {
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    pageSizeOptions?: number[];
    info: PaginationInfo
}

export default function Pagination({ setPage, setSize, pageSizeOptions = [1,5,10,20,50], info }: PaginationProps) {

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get('page') ?? '0');
    const page = Number.isNaN(pageParam) ? 0 : pageParam;
    const sizeParam = Number(searchParams.get('size') ?? '20');
    const size = Number.isNaN(sizeParam) ? 20 : sizeParam;

    const [inputPage, setInputPage] = useState(page + 1);

    const changePage = (newPage: number) => {
        setSearchParams({ page: String(newPage), size: String(size) });
        setPage(newPage);
    }

    const changeSize = (newSize: number) => {
        setSearchParams({ page: '0', size: String(newSize) });
        setPage(0)
        setSize(newSize);
    }

    return (
        <Stack direction="row" spacing={2} alignItems="center" display="flex" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="textSecondary">
                    Elementów na stronę
                </Typography>
                <FormControl size="small">
                    <Select
                        value={size}
                        onChange={(e) => {changeSize(e.target.value)}}
                    >
                        {pageSizeOptions?.map((option) => (
                            <MenuItem value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="body2" color="textSecondary">
                    {info.number * info.size + 1}–{info.number * info.size + info.numberOfElements} z {info.totalElements}
                </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                    onClick={() => changePage(page - 1)}
                    disabled={info.first}
                    size="small"
                >
                    <ArrowBackIosNewIcon fontSize="medium" />
                </IconButton>

                <TextField
                    value={inputPage}
                    onChange={(e) => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (!isNaN(num) || val === "") {
                            setInputPage(val === "" ? 0 : num);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            let newPage = Math.min(Math.max(inputPage - 1, 0), info.totalPages - 1);
                            changePage(newPage);
                        }
                    }}
                    size="small"
                    slotProps={{
                        htmlInput: {
                            style: { width: 40, textAlign: "center" }
                        }
                    }}
                />

                <Typography variant="body2" color="textSecondary">
                    z {info.totalPages}
                </Typography>

                <IconButton
                    onClick={() => changePage(page + 1)}
                    disabled={info.last}
                    size="small"
                >
                    <ArrowForwardIosIcon fontSize="medium" />
                </IconButton>
            </Stack>
        </Stack>
    );
}
