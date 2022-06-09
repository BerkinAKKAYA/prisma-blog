import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { IconButton, Typography, InputBase, MenuItem, Menu } from '@mui/material';
import { MoreVert, Logout, Login, Create, Search as SearchIcon, AccountCircle } from '@mui/icons-material';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { Tooltip } from '@mui/material';
import { useState } from 'react';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	'&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25), },
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		width: '100%',
		padding: theme.spacing(1, 1, 1, `calc(1em + ${theme.spacing(4)})`),
		transition: theme.transitions.create('width'),
		[theme.breakpoints.up('md')]: { width: '20ch', },
	},
}));

export default function Header() {
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null as (HTMLButtonElement | null));

	const user = useSession()?.data?.user || null;
	const router = useRouter();

	const buttons = {
		signedIn: [
			{ icon: <AccountCircle />, text: "My Posts", onClick: () => router.push("/my-posts") },
			{ icon: <Create />, text: "Create Post", onClick: () => router.push("/create-post") },
			{ icon: <Logout />, text: "Sign Out", onClick: () => signOut() },
		],
		notSignedIn: [
			{ icon: <Login />, text: "Sign In", onClick: () => signIn() },
		]
	}

	const MobileMenu = (
		user ? <Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			id='primary-search-account-menu-mobile'
			keepMounted
			onClose={() => setMobileMoreAnchorEl(null)}
			open={!!mobileMoreAnchorEl}
		>
			{
				buttons.signedIn.map((button, index) => (
					<MenuItem onClick={button.onClick} key={index}>
						<IconButton size="large" color="inherit">{button.icon}</IconButton>
						<p>{button.text}</p>
					</MenuItem>
				))
			}
		</Menu> : ''
	);

	const DesktopButtons = (
		user ?
			<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
				{
					buttons.signedIn.map((button, index) => (
						<Tooltip title={button.text} key={index}>
							<IconButton size="large" color="inherit" onClick={button.onClick}>
								{button.icon}
							</IconButton>
						</Tooltip>
					))
				}
			</Box>
			:
			<>
				{
					buttons.notSignedIn.map((button, index) => (
						<Tooltip title={button.text} key={index}>
							<IconButton size="large" color="inherit" onClick={button.onClick}>
								{button.icon}
							</IconButton>
						</Tooltip>
					))
				}
			</>
	)

	const MobileButtons = (
		user ? <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
			<IconButton size="large" color="inherit" onClick={e => setMobileMoreAnchorEl(e.currentTarget)}>
				<MoreVert />
			</IconButton>
		</Box > : <></>
	)

	function SearchOnSubmit(event: React.KeyboardEvent): any {
		if (event.key === 'Enter') {
			router.push("/search?query=" + (event.target as HTMLInputElement).value);
		}
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
						onClick={() => router.push('/')}
					>
						<b>Prisma Blog</b>
					</Typography>

					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onKeyDown={SearchOnSubmit} />
					</Search>

					<Box sx={{ flexGrow: 1 }} />

					{DesktopButtons}
					{MobileButtons}
				</Toolbar>
			</AppBar>
			{MobileMenu}
		</Box>
	);
}
