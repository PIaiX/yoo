import {memo, useCallback} from 'react'

const InputCount = memo(({value, full, w100, onChange, isValid = true}) => {
    const theme = getTheme()

    const styles = StyleSheet.create({
        btn: {
            borderRadius: 10,
            paddingVertical: 0,
            paddingHorizontal: 0,
            width: 35,
            height: 35,
            flex: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        btnContainer: {
            alignItems: full ? 'stretch' : 'flex-start',
            flex: full ? 0 : 1,
            width: '100%',
        },
        count: {
            flex: 1,
            alignItems: 'center',
        },
        countText: {
            lineHeight: 35,
            fontSize: 16,
            textAlign: 'center',
        },
        rowFull: {
            height: 45,
            width: w100 ? '100%' : 'auto',
            backgroundColor: theme.colors.backgroundInput,
            borderRadius: 12,
            paddingHorizontal: 5,
        },
        row: {
            width: full || w100 ? '100%' : 120,
            flexDirection: 'row',
            justifyContent: full ? 'space-between' : 'flex-start',
            alignSelf: 'flex-start',
            alignItems: 'center',
        },
    })

    const onCount = useCallback((e) => {
        if (e > 100) return showMessage('Максимальное кол-во 100')
        if (e < 0) return
        onChange && onChange(e)
    }, [])

    return (
        <View style={[styles.row, full && styles.rowFull]}>
            <View>
                <Button
                    style={styles.btn}
                    styleContainer={styles.btnContainer}
                    size={full ? 'large' : 'small'}
                    onPress={() => onCount(value - 1)}
                >
                    <Icon name="remove-outline" size={20} color={theme.colors.primaryText} />
                </Button>
            </View>
            <View style={styles.count}>
                <Text style={styles.countText}>{value}</Text>
            </View>
            <View>
                <Button
                    style={styles.btn}
                    styleContainer={styles.btnContainer}
                    isValid={isValid}
                    size={full ? 'large' : 'small'}
                    onPress={() => onCount(value + 1)}
                >
                    <Icon
                        name="add-outline"
                        size={20}
                        color={isValid ? theme.colors.primaryText : '#999'}
                    />
                </Button>
            </View>
        </View>
    )
})
export default InputCount
