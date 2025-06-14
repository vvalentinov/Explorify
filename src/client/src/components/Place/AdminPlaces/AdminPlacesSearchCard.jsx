import styles from './AdminPlacesSearchCard.module.css';

import {
    Spin,
    ConfigProvider,
    Empty,
    Input,
    Select,
    Cascader,
    Button,
    Typography,
    Radio
} from "antd";

import {
    SearchOutlined,
    AppstoreOutlined,
    GlobalOutlined,
    TagsOutlined,
} from '@ant-design/icons';

import { entityState } from '../../../constants/entityState';

import { motion, AnimatePresence } from "framer-motion";

import { useState } from 'react';

const AdminPlaceSearchCard = ({
    state,
    dispatch,
    categoryOptions,
    countryOptions,
    setCountryOptions,
    tags,
    skipNextSearchRef,
    handleFilterChange,
    recordsCount
}) => {

    const [showTagsSearch, setShowTagsSearch] = useState(false);
    const [showCountrySearch, setShowCountrySearch] = useState(false);
    const [showCategorySearch, setShowCategorySearch] = useState(false);

    const fadeSlide = {
        initial: { opacity: 0, y: 10 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.15, ease: "easeIn" }
        }
    };

    const toggleCategorySearch = () => {
        setShowCategorySearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadCategory = state.selectedCategoryPath?.length > 0;
                dispatch({ type: 'SET_CATEGORY', payload: [] });
                if (!hadCategory) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };

    const toggleCountrySearch = () => {
        setShowCountrySearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadCountry = state.selectedCountryId !== null;
                dispatch({ type: 'SET_COUNTRY', payload: null });
                if (!hadCountry) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };

    const toggleTagsSearch = () => {
        setShowTagsSearch(prev => {
            const newVal = !prev;

            if (!newVal) {
                const hadTags = state.selectedTagIds?.length > 0;
                dispatch({ type: 'SET_TAGS', payload: [] });
                if (!hadTags) {
                    skipNextSearchRef.current = true;
                }
            }

            return newVal;
        });
    };

    const filterOptions = [
        { label: entityState.Approved, value: entityState.Approved },
        { label: entityState.Unapproved, value: entityState.Unapproved },
        { label: 'Recently Deleted', value: entityState.Deleted },
    ];

    return (

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

            <div className={styles.adminSearchPanel}>

                <Typography.Title level={3} className={styles.searchTitle}>
                    <SearchOutlined />
                    {`Search in ${state.filter} Places (${recordsCount})`}
                </Typography.Title>

                <ConfigProvider
                    theme={{
                        components: {
                            Radio: {
                                colorPrimary: '#888',
                                colorText: '#f0f0f0',
                                buttonSolidCheckedBg: '#888',
                                buttonSolidCheckedColor: '#fff',
                                colorBorder: '#555',
                                borderRadius: 8,
                                fontSize: 16,
                            },
                        },
                    }}
                >
                    <Radio.Group
                        value={state.filter}
                        onChange={handleFilterChange}
                        name="Sort"
                        className={styles.radioGroup}
                    >
                        {filterOptions.map((opt) => (
                            <Radio key={opt.value} value={opt.value} className={styles.radioOption}>
                                {opt.label}
                            </Radio>
                        ))}
                    </Radio.Group>
                </ConfigProvider>


                <ConfigProvider
                    theme={{
                        token: {
                            colorTextPlaceholder: '#fff'
                        },
                        components: {
                            Input: {
                                colorBgContainer: '#1e1e2f',
                                colorText: '#f0f0f0',
                                colorBorder: '#444',
                                colorBorderHover: '#555',
                                colorPrimary: '#1677ff',
                                borderRadius: 12,
                                fontSize: 20,
                                controlHeight: 48,
                                colorBorderHover: '#666',
                                colorPrimary: '#888',
                                hoverBorderColor: '#666',

                            },
                        },
                    }}
                >
                    <div className={styles.inputWrapper}>
                        <Input
                            name="PlaceName"
                            allowClear
                            placeholder="Start typing place name here..."
                            value={state.placeName}
                            onChange={(e) =>
                                dispatch({ type: 'SET_PLACE_NAME', payload: e.target.value })
                            }
                        />
                    </div>
                </ConfigProvider>


                <div className={styles.toggleButtonsWrapper}>
                    <Button
                        variant='solid'
                        icon={<AppstoreOutlined />}
                        onClick={toggleCategorySearch}
                        className={`${styles.searchButtonFilter} ${showCategorySearch ? styles.active : ''}`}
                    >
                        Category Search
                    </Button>
                    <Button
                        variant='solid'
                        icon={<GlobalOutlined />}
                        onClick={toggleCountrySearch}
                        className={`${styles.searchButtonFilter} ${showCountrySearch ? styles.active : ''}`}
                    >
                        Country Search
                    </Button>
                    <Button
                        variant='solid'
                        icon={<TagsOutlined />}
                        onClick={toggleTagsSearch}
                        className={`${styles.searchButtonFilter} ${showTagsSearch ? styles.active : ''}`}
                    >
                        Tags Search
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>

                    <AnimatePresence mode="wait">
                        {showCategorySearch && (
                            <motion.div
                                key="categorySearch"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={fadeSlide.transition}
                                variants={fadeSlide}
                            >
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorBgContainer: '#1e1e2f',
                                            colorPrimary: '#fff',
                                            colorIcon: '#fff',
                                            colorText: '#fff',
                                            fontSize: 20,
                                            colorTextPlaceholder: '#fff',
                                            colorBorder: '#666',
                                        },
                                        components: {
                                            Cascader: {
                                                hoverBorderColor: '#666',
                                                colorPrimary: '#fff',
                                                controlItemBgHover: '#333',
                                                controlItemBgActive: '#444',
                                                borderRadius: 12,
                                                controlOutline: 'none',
                                                controlOutlineWidth: 0,
                                                controlItemBgActive: '#444',
                                            },
                                            Select: {
                                                hoverBorderColor: '#666',
                                                colorPrimary: '#fff',
                                                borderRadius: 12,
                                                activeBorderColor: '#666',
                                            },
                                            Input: {
                                                hoverBorderColor: '#666',
                                                colorPrimary: '#fff',
                                                borderRadius: 12,
                                                activeShadow: 'none',
                                            }
                                        }
                                    }}
                                >
                                    <Cascader
                                        prefix={
                                            <AppstoreOutlined style={{ color: '#fff', fontSize: 20, marginRight: 10 }} />
                                        }
                                        options={categoryOptions}
                                        value={state.selectedCategoryPath}
                                        onChange={(value) => dispatch({ type: 'SET_CATEGORY', payload: value })}
                                        placeholder="Select category/subcategory"
                                        allowClear
                                        style={{
                                            width: '100%',
                                            fontFamily: 'Poppins, Segoe UI, sans-serif',
                                        }}
                                        size="large"
                                        changeOnSelect
                                        expandTrigger="hover"
                                        classNames={{ popup: { root: 'customCascaderDropdown' } }}
                                        className={styles.cascaderInput}
                                    />
                                </ConfigProvider>

                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">

                        {showCountrySearch && (
                            <motion.div
                                key="categorySearch"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={fadeSlide.transition}
                                variants={fadeSlide}
                            >
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorBgContainer: '#1e1e2f',
                                            colorPrimary: '#fff',
                                            colorText: '#fff',
                                            colorTextPlaceholder: '#fff',
                                            colorBorder: '#666',
                                            fontSize: 20,
                                        },
                                        components: {
                                            Select: {
                                                colorPrimary: '#fff',
                                                hoverBorderColor: '#666',
                                                activeBorderColor: '#666',
                                                borderRadius: 12,
                                                optionSelectedBg: '#444',
                                                optionSelectedColor: '#fff',
                                                controlOutline: 'none',
                                                controlOutlineWidth: 0,
                                                controlItemBgActive: '#444',
                                            },
                                            Input: {
                                                hoverBorderColor: '#666',
                                                colorPrimary: '#fff',
                                                activeShadow: 'none',
                                                borderRadius: 12,
                                            },
                                            Empty: {
                                                colorBgBase: '#fff'
                                            }
                                        }
                                    }}
                                >
                                    <Select
                                        className={styles.countriesSelect}
                                        classNames={{ popup: { root: 'customCountryDropdown' } }}
                                        prefix={<GlobalOutlined style={{ color: '#fff', fontSize: 20, marginRight: 10 }} />}
                                        size='large'
                                        showSearch
                                        allowClear
                                        placeholder="Start typing and select a country..."
                                        optionFilterProp="label"
                                        style={{ width: '100%' }}
                                        value={state.selectedCountryId}
                                        onSearch={(value) => {
                                            dispatch({ type: 'SET_COUNTRY_SEARCH', payload: value });
                                            dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: true });

                                            if (value.trim() === '') {
                                                dispatch({ type: 'SET_COUNTRY_LOADING', payload: false });
                                                setCountryOptions([]);
                                            } else {
                                                dispatch({ type: 'SET_COUNTRY_LOADING', payload: true });
                                            }
                                        }}
                                        onChange={(value) => dispatch({ type: 'SET_COUNTRY', payload: value })}
                                        onBlur={() => {
                                            setCountryOptions([]);
                                            dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: false });
                                        }}
                                        open={state.openCountryDropdown}
                                        onOpenChange={(open) => {
                                            if (!state.countryLoading) {
                                                dispatch({ type: 'SET_OPEN_COUNTRY_DROPDOWN', payload: open });
                                            }
                                        }}
                                        notFoundContent={
                                            state.countryLoading ? (
                                                <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                                                    <ConfigProvider
                                                        theme={{
                                                            components: {
                                                                Spin: { colorPrimary: '#fff' }
                                                            }
                                                        }}
                                                    >
                                                        <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                                                            <Spin style={{ transform: 'scale(1.5)' }} size="large" />
                                                        </div>
                                                    </ConfigProvider>
                                                </div>
                                            ) : <Empty style={{ transform: 'scale(1.2)', margin: '2rem 0', color: '#fff' }} />
                                        }
                                        options={countryOptions}
                                    />
                                </ConfigProvider>

                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode='wait'>
                        {showTagsSearch && (
                            <motion.div
                                key="categorySearch"
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={fadeSlide.transition}
                                variants={fadeSlide}
                            >

                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorBgContainer: '#1e1e2f',
                                            colorText: '#fff',
                                            colorTextPlaceholder: '#fff',
                                            colorBorder: '#666',
                                            colorPrimary: '#fff',
                                            fontSize: 20,
                                        },
                                        components: {
                                            Select: {
                                                colorPrimary: '#fff',
                                                hoverBorderColor: '#666',
                                                activeBorderColor: '#666',
                                                borderRadius: 12,
                                                optionSelectedBg: '#444',
                                                optionSelectedColor: '#fff',
                                                controlItemBgActive: '#444',
                                                controlOutline: 'none',
                                                controlOutlineWidth: 0,
                                                controlItemBgActive: '#444',
                                            },
                                            Input: {
                                                hoverBorderColor: '#666',
                                                colorPrimary: '#fff',
                                                activeShadow: 'none',
                                                borderRadius: 12,
                                                fontSize: 30
                                            }
                                        }
                                    }}
                                >
                                    <Select
                                        styles={{
                                            popup: {
                                                root: {
                                                    width: '40%',
                                                }
                                            }
                                        }}
                                        className={styles.tagsSelect}
                                        classNames={{ popup: { root: 'adminTagsSelectDropdown' } }}
                                        prefix={<TagsOutlined style={{ color: '#fff', marginRight: 10 }} />}
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Select Tags"
                                        onChange={(value) => {
                                            if (value.length <= 20) {
                                                dispatch({ type: 'SET_TAGS', payload: value });
                                            }
                                        }}
                                        options={tags}
                                        size='large'
                                        allowClear
                                        showSearch
                                        optionFilterProp="label"
                                        value={state.selectedTagIds}
                                    />
                                </ConfigProvider>

                            </motion.div>
                        )}

                    </AnimatePresence>

                </div>

            </div>

        </div>

    );
};

export default AdminPlaceSearchCard;